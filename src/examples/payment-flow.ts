import { AbstractPay } from "..";
AbstractPay.initialise({
  apiKey: '',
  baseUrl: ''
});
const paySdk = new AbstractPay();

paySdk.initialisePayment({}).then((response) => { }).catch((error) => { });
