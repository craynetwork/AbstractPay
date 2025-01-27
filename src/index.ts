import { apiCall } from "./api/client";
import { IOrderParams } from "./api/types";
import { sdkConfig } from "./config";
import { IDomainData } from "./types/common";

export class AbstractPay {
  private owner: any;
  constructor(config: { apiKey: string; baseUrl: string }) {
    sdkConfig.setConfig(config.apiKey, config.baseUrl);
  }

  setOwnerWallet(owner: { signMessage: (hash: string) => Promise<string>, signTypedData: (data: IDomainData) => Promise<string>, getOwnerAddress: () => string }) {
    this.owner = owner
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
    // todo: check if spender is SCA then sign seperately for all chains
    // const orders = Array.isArray(orderHash) ? orderHash : [orderHash];
    if (!this.owner) throw new Error('Owner wallet not set');
    // const signedOrder = await Promise.all(orders.map(async (hash) => {
    const signedOrder = await this.owner.signMessage(orderHash);
    // }));
    const signedApprovalData = allowanceData && await Promise.all(allowanceData.map(async (data) => {
      const signature = await this.owner.signTypedData({
        types: data.types,
        domain: data.domainData,
        message: data.values,
        primaryType: 'Permit'
      });
      return { r: signature.slice(0, 66), s: '0x' + signature.slice(66, 130), v: '0x' + signature.slice(130, 132), chainId: data.domainData.chainId, verifyingContract: data.domainData.verifyingContract, walletAddress: this.owner.getOwnerAddress(), value: data.values.value, deadline: data.values.deadline };
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
      return apiCall(`/scan-and-pay/${orderId}`, 'PUT', { spenderAddress: payerAddress });
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
}