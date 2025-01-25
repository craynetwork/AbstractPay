
export interface IDestinationAction {
  payload: string // The bytecode for the action to execute on the destination chain.
  gasLimit: number // The maximum gas limit for the action on the destination chain.
}

export interface IDomainData {
  domainData: { chainId: number; verifyingContract: string; version: string; name: string; nonce: number }
  types: {}
  values: { deadline: string; value: number }
}