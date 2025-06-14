// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Temporarily ignore type error, fix later
import { encodeFunctionData, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { AbstractPay } from '../src/index';
const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "sell",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
]
const BASEURL = process.env.BASE_URL || 'http://localhost:4000/api/'
const APIKEY = process.env.API_KEY || '0000-0000-0000-0000-0000'
const sdk = new AbstractPay({
  apiKey: APIKEY,
  baseUrl: BASEURL
});
const privateKey = process.env.PRIVATE_KEY || "0x<your private key goes here>"

const account = privateKeyToAccount(privateKey as Hex);

sdk.setOwnerWallet(account)

// prepare the relay request
const chainId = 84532 
const targetContractAddress = '0x30104Aa61937bf56c00aA1cfFc63738A799C7123' // this is contract address you want to call.
const destinationCallData = encodeFunctionData({
  abi: ABI,
  functionName: 'sell',
  args: [account.address, 100000],
})
// const DESTINATION_ACTION_ADDRESS_ARB = '0x789AFb371459EeD6fE3C22F6d71EB58817C64098'

const relayRequest = {
  chainId: chainId,
  targetContract: targetContractAddress,
  callData: destinationCallData,
  actionType: "sell-test",
};

sdk.relayAction(relayRequest).then((res: any) => { console.log(res) }).catch((err: any) => { console.error(err) })
