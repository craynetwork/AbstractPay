import { Hex, TypedDataDomain } from "viem";

export const domain = (chainId: number, verifyingContract: string): TypedDataDomain => ({
  name: "CrayRelay",
  version: "1",
  chainId,
  verifyingContract: verifyingContract as Hex,
});

export const relayTypes: Record<string, any[]> = {
  RelayRequest: [
    { name: "user", type: "address" },
    { name: "targetContract", type: "address" },
    { name: "actionType", type: "string" },
    { name: "callData", type: "bytes" },
    { name: "nonce", type: "uint256" },
  ],
};

export const generateNonce = (): bigint => { 
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const hex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return BigInt('0x' + hex);
}