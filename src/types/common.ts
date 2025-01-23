
export interface IDestinationAction {
  payload: string // The bytecode for the action to execute on the destination chain.
  gasLimit: number // The maximum gas limit for the action on the destination chain.
}