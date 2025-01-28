// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Temporarily ignore type error, fix later
import { Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { AbstractPay } from '../src/index';
const BASEURL = process.env.BASE_URL || 'https://dev-api.cray.network/api/'
const APIKEY = process.env.API_KEY || '0000-0000-0000-0000-0000'
const sdk = new AbstractPay({
  apiKey: APIKEY,
  baseUrl: BASEURL
});
const privateKey = process.env.PRIVATE_KEY || "0x<your private key goes here>"

const account = privateKeyToAccount(privateKey as Hex);

sdk.setOwnerWallet({
  signMessage: (async (hash: string) => {
    return account.signMessage({ message: hash });
  }),
  signTypedData: (async (data: any) => {
    return account.signTypedData(data)
  }),
  getOwnerAddress: (() => {
    return account.address
  })
})
const senderAddress = account.address as string
console.log('senderAddress:', senderAddress)
// ------------------ pay ------------------
const payParams = {
  receiverAddress: '0xf66f409086647591e0c2f122C1945554b8e0e74F',
  destinationChain: 421614,
  destinationToken: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  amount: '0.1',
  orderType: 'p2p',
  senderAddress,
}

sdk.pay(payParams).then((res) => { console.log(res) }).catch((err) => { console.error(err) })

// ------------------ Sign OrderHash ------------------
// const orderHash = ['0x4062fe1da0763030c0c34fb41c848502e7adecaec8540657be57721bcfa761b5']

// sdk.signPaymentData(orderHash).then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.error(err)
// })