import { stringToBytes } from "viem";
import { apiCall } from "./api/client";
import { IOrderParams, ISubmitOrderParams } from "./api/types";
import { sdkConfig } from "./config";
import { IDomainData } from "./types/common";

export class AbstractPay {
  private owner: any;
  constructor(config: { apiKey: string; baseUrl: string }) {
    sdkConfig.setConfig(config.apiKey, config.baseUrl);
  }

  setOwnerWallet(owner: { signMessage: (hash: string) => Promise<string>, signTypedData: (data: IDomainData) => Promise<string> }) {
    this.owner = owner
  }

  // Create a new payment order
  public async initialisePayment(params: IOrderParams) {
    try {
      return apiCall('/create-order', 'POST', params);
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  }

  // sign Order
  public async signPaymentData(orderHash: string[], allowanceData?: IDomainData[]) {
    // todo: check if spender is SCA then sign seperately for all chains
    if (!this.owner) throw new Error('Owner wallet not set');
    const signedOrder = await Promise.all(orderHash.map(async (hash) => {
      return this.owner.signMessage(stringToBytes(hash));
    }));
    console.log('signedOrder', signedOrder);
    const signedApprovalData = allowanceData && await Promise.all(allowanceData.map(async (data) => {
      return this.owner.signTypedData(data);
    }));
    return { signedOrder, signedApprovalData };
  }

  // Submit a signed payment Order
  public async submitOrder(orderId: string, params: ISubmitOrderParams) {
    try {
      return apiCall(`/submit-order/${orderId}`, 'POST', params);
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
      const { signedOrder } = await this.signPaymentData(orderHash);
      // console.log('signedData', signedData, allowance);
      // return this.submitOrder(orderHash, { signedOrder });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
}