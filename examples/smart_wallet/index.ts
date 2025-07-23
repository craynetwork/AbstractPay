import 'dotenv/config';
import { arbitrumSepolia, baseSepolia } from 'viem/chains';
import { AbstractPay } from '../../src';
import getSmartAccount from './get_wallet';

const BASEURL = process.env.BASE_URL!;
const APIKEY = process.env.API_KEY!;

const main = async () => {
  const arbAccount = await getSmartAccount(arbitrumSepolia);
  const baseAccount = await getSmartAccount(baseSepolia);
  const sdk = new AbstractPay({
    apiKey: APIKEY,
    baseUrl: BASEURL,
    testnet: true,
  });
  sdk.setOwnerWallet([
    {
      chainId: arbitrumSepolia.id,
      wallet: arbAccount,
    },
    {
      chainId: baseSepolia.id,
      wallet: baseAccount,
    },
  ]);

  sdk
    .pay({
      destinationChain: arbitrumSepolia.id,
      amount: '15',
      orderType: 'p2p',
      sourceTokens: [
        {
          chainId: baseSepolia.id,
        },
        {
          chainId: arbitrumSepolia.id,
        },
      ],
      senderAddress: sdk.walletAddress,
      receiverAddress: sdk.walletAddress,
    })
    .then((res: any) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
    });
};
main();
