import { IDestinationAction } from "../types/common";

export interface IOrderParams {
  /**
   * The receiver's address on the destination chain.
   */
  receiverAddress: string;

  /**
   * The chain ID of the destination where the payment will be received.
   */
  destinationChain: number;

  /**
   * The token address on the destination chain in which the payment will be made.
   */
  destinationToken: string;

  /**
   * The amount to send, specified in plain dollar terms (e.g., "1" for $1).
   */
  amount: string;

  /**
   * The order type, indicating the use case or context:
   * -p2p: Peer-to-peer payment.
   * -merchant: Payment to a merchant.
   * -dapp: Payment to a dApp."
   */
  orderType: string;

  // Optional Parameters

  /**
   * The minimum amount to receive on the destination chain.
   * Defaults to the full amount after fees and slippage if not provided.
   */
  minAmountOut?: string;

  /**
   * The calldata for an action on the destination chain,
   * triggered at the smart contract address specified in receiverAddress.
   */
  action?: IDestinationAction;

  /**
    * Specifies the source token and chain for payment.
    * If provided, the specified token and chains will be used.
    * If not provided, spending tokens are automatically determined based on available balances.
   */
  sourceToken?: [{ address?: string, chainId: number }];

  /**
   * An optional note for tracking or additional information.
   */
  remark?: string;

  /**
   * The sender's address. This field is optional only if the order is created by the receiver
   * e.g. the accepter/receiver of the payment. 
   * In all other cases, the sender's address must be provided.
   */
  senderAddress?: string;

  /**
   * An order ID, used only after a spender is attached, for accepter-created orders without a spender address.
   */
  orderId?: string;
}

export interface ISubmitOrderParams {
  /**
   * Array of strings representing the signed order data.
   * - For EOAs (Externally Owned Accounts): This array will contain only one item.
   * - For SCAs (Smart Contract Accounts): If spending from more than one chain, this array
   *   must include a signed order hash for each chain separately.
   */
  signedOrder: string;

  /**
   * Optional array of signed approval data objects, if applicable.
   * - This is required in cases if approvals are necessary for the transaction.
   */
  signedApprovalData?: [ISignedApprovalData]
}

export interface ISignedApprovalData {
  chainId: number
  v: number
  r: string
  s: string
  verifyingContract: string
  walletAddress: string
  value: number
  deadline: string
}
