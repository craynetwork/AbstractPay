
export interface IDestinationAction {
  payload: {
    abi: any;
    functionName: string;
    args: any[];
  }; // This will prepare bytecode for the action to execute on the destination chain.
  gasLimit: number // The maximum gas limit for the action on the destination chain.
}

export interface IDomainData {
  domainData: { chainId: number; verifyingContract: string; version: string; name: string; nonce: number }
  types: {}
  values: { deadline: string; value: number }
}

export type RelayParams = {
  chainId: number;
  targetContract: string;
  callData: string;
  actionType: string;
};

export interface ISmartWallet{
  chainId: number;
  wallet: any
}