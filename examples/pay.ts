// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Temporarily ignore type error, fix later
import { Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { AbstractPay } from '../src/index';
const BASEURL = process.env.BASE_URL || 'http://localhost:4000/api/'
const APIKEY = process.env.API_KEY || '0000-0000-0000-0000-0000'
const sdk = new AbstractPay({
  apiKey: APIKEY,
  baseUrl: BASEURL,
  testnet: true,
});
const privateKey = process.env.PRIVATE_KEY || "0x<your private key goes here>"

const account = privateKeyToAccount(privateKey as Hex);
const ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'notDotToken_', type: 'address' },
      { internalType: 'address', name: 'receiver_', type: 'address' },
      { internalType: 'uint256', name: 'amount_', type: 'uint256' }
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
sdk.setOwnerWallet(account)
const senderAddress = account.address as string
console.log('senderAddress:', senderAddress)
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
const WRAPPER_ADDRESS = '0x6915cFa5B31063f71c38F1Cb6518935d62Ad2313' // this is the wrapper address for USDC on Base Sepolia
const targetContractAddress = '0x30104Aa61937bf56c00aA1cfFc63738A799C7123' // this is contract address you want to call.
const noOfTokens = 100000 // this is the amount of tokens you want to buy.
// ------------------ pay ------------------
const chainId = 84532
const payParams = {
  receiverAddress: WRAPPER_ADDRESS,
  destinationChain: chainId,
  destinationToken: USDC_ADDRESS,
  amount: '0.1',
  orderType: 'p2p',
  senderAddress,
  action: {
    payload: {
      abi: ABI,
      functionName: 'buy',
      args: [targetContractAddress, account.address.toString(), noOfTokens]
    },
    gasLimit: 200000
  }
}

sdk.pay(payParams).then((res: any) => { console.log(res) }).catch((err: any) => { console.error(err) })

// ------------------ Sign OrderHash ------------------
// const orderHash = ['0x4062fe1da0763030c0c34fb41c848502e7adecaec8540657be57721bcfa761b5']

// sdk.signPaymentData(orderHash).then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.error(err)
// })