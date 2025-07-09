import { Account, WalletClient } from "viem";
import { apiCall } from "./api/client";
import { IOrderParams } from "./api/types";
import { sdkConfig } from "./config";
import { CRAY_RELAY_ADDRESSES } from "./config/contractAddresses";
import { IDomainData, ISmartWallet, RelayParams } from "./types/common";
import { domain, generateNonce, relayTypes } from "./utils/tx";

export class AbstractPay {
  private owners: any;
  public walletAddress: any;
  private isSmartWallet: boolean = false
  constructor(config: { apiKey: string; baseUrl: string, testnet?: boolean }) {
    sdkConfig.setConfig(config.apiKey, config.baseUrl, config.testnet);
  }
// SmartAccountClient
  setOwnerWallet(owner: Account | WalletClient | ISmartWallet[]) {
    if(Array.isArray(owner)){
      /** SCA */
      this.owners = owner
      this.isSmartWallet = true
      this.walletAddress = this.owners[0].wallet.account.address
      this.owners.forEach(({wallet}: ISmartWallet)=>{
        if(this.walletAddress !== wallet.account?.address){
          throw new Error("All Smart Wallets should be the same wallet on different chains")
        }
      })
    }else{
      this.owners = [{ wallet: owner }]
      this.walletAddress = this.owners[0].wallet.address || this.owners[0].wallet.account.address
    }
  }

  // Create a new payment order
  public async initialisePayment(params: IOrderParams) {
    try {
      return apiCall('/create-order', 'POST', { params });
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  }

  // sign Order
  public async signPaymentData(orderHash: string, allowanceData?: IDomainData[]) {
    // todo: check if spender is SCA then sign separately for all chains
    // const orders = Array.isArray(orderHash) ? orderHash : [orderHash];
    if (!this.owners) throw new Error('Owner wallet not set');
    const signedOrder = await Promise.all(this.owners.map(async({chainId, wallet}:ISmartWallet)=>({
      chainId,
      data: await wallet.signMessage({ message: { raw: orderHash } })
    })))
    const signedApprovalData = allowanceData && await Promise.all(allowanceData.map(async (data) => {
      let wallet
      if(this.isSmartWallet){
        wallet = this.owners.find((wallet:ISmartWallet)=> wallet.chainId === data.domainData.chainId)
      }else{
        wallet = this.owners[0]
      }
      const signature = await wallet.signTypedData({
        types: data.types,
        domain: data.domainData,
        message: data.values,
        primaryType: 'Permit'
      });
      return { r: signature.slice(0, 66), s: '0x' + signature.slice(66, 130), v: '0x' + signature.slice(130, 132), chainId: data.domainData.chainId, verifyingContract: data.domainData.verifyingContract, walletAddress: this.walletAddress, value: data.values.value, deadline: data.values.deadline };
    }));
    return { signedOrder, signedApprovalData };
  }

  // Submit a signed payment Order
  public async submitOrder(orderId: string, params: any) {
    try {
      return apiCall(`/submit-order/${orderId}`, 'POST', { params });
    } catch (error) {
      console.error('Error submitting payment order:', error);
      throw error;
    }
  }

  // Associates the sender's address with an existing order in a scan-and-pay workflow
  public async setPayerForOrder(orderId: string, payerAddress: string) {
    try {
      return apiCall(`/set-payee/${orderId}`, 'PUT', { spenderAddress: payerAddress });
    }
    catch (error) {
      console.error('Error setting payer for order:', error);
      throw error;
    }
  }

  // Perform payment in one method (frontend integration convenience)
  public async pay(param: IOrderParams) {
    try {
      const result = await this.initialisePayment(param);
      const { orderHash, allowance } = result;
      const { signedOrder, signedApprovalData } = await this.signPaymentData(orderHash, allowance);
      return this.submitOrder(orderHash, { signedOrder, signedApprovalData });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  public async relayAction(
    params: RelayParams,
  ) {
    try {
      const verifyingContract = this.getCrayRelayAddress(params.chainId);
      const message = {
        user: this.walletAddress,
        targetContract: params.targetContract,
        actionType: params.actionType,
        callData: params.callData,
        nonce: generateNonce().toString(),
      }
      const signature = await this.owners.signTypedData({
      domain: domain(params.chainId, verifyingContract),
      types: relayTypes,
      message,
      primaryType: 'RelayRequest'
      });
      const sigsplit = { r: signature.slice(0, 66), s: '0x' + signature.slice(66, 130), v: '0x' + signature.slice(130, 132) };
      return apiCall('/relay', 'POST', { params: { ...message, chainId: params.chainId, ...sigsplit } });
    } catch (error) {
      console.error('Error relay request:', error);
      throw error;
    }
  }

  // private functions can be added here for internal use
  private getCrayRelayAddress(chainId: number): string {
    const address = CRAY_RELAY_ADDRESSES[chainId];
    if (!address) throw new Error(`Unsupported chainId: ${chainId}`);
    return address;
  }
}
