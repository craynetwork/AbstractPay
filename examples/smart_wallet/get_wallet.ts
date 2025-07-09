import 'dotenv/config';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { Hex, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { entryPoint07Address } from 'viem/account-abstraction';
import { createSmartAccountClient } from 'permissionless';

const apiKey = process.env.PIMLICO_API_KEY!;

const privateKey = process.env.PRIVATE_KEY as Hex;
const pimlicoUrl = `https://api.pimlico.io/v2/421614/rpc?apikey=${apiKey}`;

const pimlicoClient = createPimlicoClient({
  transport: http(pimlicoUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: '0.7',
  },
});
const getSmartAccount = async (chain) => {
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  const account = await toSafeSmartAccount({
    client: publicClient,
    owners: [privateKeyToAccount(privateKey)],
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    }, // global entrypoint
    version: '1.4.1',
  });
  return createSmartAccountClient({
    account,
    bundlerTransport: http(pimlicoUrl),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });
};
export default getSmartAccount