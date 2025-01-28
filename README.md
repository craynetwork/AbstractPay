# AbstractPay

The chain-abstracted payment SDK for seamless stablecoin transactions across blockchains.

AbstractPay is a powerful, Convenient, and secure SDK designed to make cross-chain payments simple and fast. With AbstractPay, developers can enable users to spend and accept fragmented stablecoins from any chain to any chain in seconds.

## Features

- **Fast**: Payments complete in seconds.
- **Convenient**: Let your users pay with any stablecoin, from any chain.
- **Simple**: Pay in a single step.
- **Secure**: No extra counterparties—AbstractPay never holds user funds.

## Use Cases

1. **For Developers**:  
   Onboard users from any chain and allow them to always pay using fragmented stablecoins.
2. **For DApps**:  
   Accept payments from any chain and provide users with the simplicity of always paying in stablecoins.

---

## Installation

Install AbstractPay using npm:

```bash
npm install abstractpay
```

## Usage

### Initialize the SDK

For API key access, reach out to us directly via direct message or email.

```typescript
import { AbstractPay } from 'abstractpay-sdk';

const sdk = new AbstractPay({
  apiKey: '<your-api-key>',
  baseUrl: '<api-base-url>',
});

// Set the owner's wallet for signing transactions
sdk.setOwnerWallet({
  signMessage: async (hash: string) => {
    return wallet.signMessage(hash);
  },
  signTypedData: async (data: any) => {
    return wallet.signTypedData(data);
  },
});
```

### One click payment

```typescript
const paymentParams = {
  receiverAddress: '<recipient-address>',
  amount: '2.2', // amount in dollars
  destinationChain: 421614, // Arbitrum sepolia
  destinationToken: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // USDC
  orderType: 'p2p',
  senderAddress: '<sender-address>',
};

const order = await sdk.pay(paymentParams);
console.log('Order Created:', order);
```

## Other Example Workflow

1. **User Initiates Payment**: The DApp calls `initialisePayment` to create a payment order.
2. **User Signs the Order**: The SDK handles signing of the order hash.
3. **Payment Submission**: The signed payment is submitted to AbstractPay's backend for processing.

---

## License

AbstractPay is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## Feedback & Contributions

We welcome contributions to improve AbstractPay! Feel free to open issues, suggest features, or submit pull requests.

For any questions or feedback, contact us at [hello@cray.network](mailto:hello@cray.network).
