// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Temporarily ignore type error, fix later
import { privateKeyToAccount } from 'viem/accounts';
import { AbstractPay } from '../src/index';
const BASEURL = 'https://watcher.cray.network/api/'
const APIKEY = '0000-0000-0000-0000-0000'
const sdk = new AbstractPay({
  apiKey: APIKEY,
  baseUrl: BASEURL
});
const privateKey = "0x<your private key goes here>"

const account = privateKeyToAccount(privateKey);

sdk.setOwnerWallet({
  signMessage: (async (hash: string) => {
    return account.signMessage({ message: hash });
  }),
  signTypedData: (async (data: any) => {
    return account.signTypedData(data)
  })
})
// ------------------ pay ------------------
// sdk.pay().then((res) => { console.log(res) }).catch((err) => { console.error(err) })

// ------------------ Sign OrderHash ------------------
const orderHash = ['0x4062fe1da0763030c0c34fb41c848502e7adecaec8540657be57721bcfa761b5']

sdk.signPaymentData(orderHash).then((res) => {
  console.log(res)
}).catch((err) => {
  console.error(err)
})