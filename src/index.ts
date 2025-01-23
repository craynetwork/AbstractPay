import { apiCall } from "./api/client";
import { IOrderParams } from "./api/types";
import { sdkConfig } from "./config";

export class AbstractPay {
  public static initialise(config: { apiKey: string; baseUrl: string }) {
    sdkConfig.setConfig(config.apiKey, config.baseUrl);
  }

  // Initialise Payment
  public async initialisePayment(params: IOrderParams) {
    return apiCall('/create-order', 'POST', params);
  }

  // sign Order
  public async signOrder(orderId: string) {
  }

  // Submit signed Order
  public async submitOrder(orderId: string, params: any) {
    return apiCall(`/submit-order/${orderId}`, 'POST', params);
  }

  // Associates the sender's address with an existing order in a scan-and-pay workflow
  public async setPayerForOrder(orderId: string, payerAddress: string) {
    return apiCall(`/scan-and-pay/${orderId}`, 'PUT', { spenderAddress: payerAddress });
  }

}