# Anonymous Sports Group Buying Platform

A privacy-preserving sports equipment group purchasing platform powered by Zama's Fully Homomorphic Encryption (FHE) technology on Ethereum Sepolia testnet.

## 🎯 Overview

This decentralized application enables users to participate in group buying of sports equipment while maintaining complete privacy of their purchase quantities and amounts. Built with FHE technology, all sensitive transaction data is encrypted on-chain, ensuring that neither merchants nor other buyers can access individual purchase information.

## 🔐 Core Concepts

### Fully Homomorphic Encryption (FHE)

The platform leverages Zama's FHE technology to enable computations on encrypted data without decryption. This means:

- **Encrypted Orders**: Purchase quantities and amounts are encrypted before being stored on-chain
- **Private Aggregation**: The smart contract can compute total orders and collected amounts without revealing individual contributions
- **Selective Revelation**: Only the buyer can decrypt and reveal their specific order details when needed

### Anonymous Group Purchasing

Traditional group buying platforms expose purchase patterns and quantities, potentially revealing:
- Individual spending habits
- Bulk purchase strategies
- Competitive intelligence for businesses

Our FHE-based approach ensures:
- **Quantity Privacy**: Your purchase amount remains encrypted
- **Price Privacy**: Payment amounts are only visible to you
- **Pattern Protection**: No one can analyze your buying behavior
- **Fair Participation**: All participants benefit from group discounts without information asymmetry

## 🏗️ Smart Contract Architecture

### Contract Address
```
Sepolia Testnet: 0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431
```

### Key Features

**Product Management**
- Create group buying campaigns with customizable parameters
- Set minimum/maximum order quantities
- Define deadlines for participation
- Support multiple product categories (Footwear, Clothing, Equipment, Accessories, Fitness)

**Encrypted Order Placement**
- Orders are encrypted using FHE before submission
- Smart contract validates encrypted data without decryption
- Automatic payment collection in encrypted form

**Privacy-Preserving Statistics**
- View total number of participants (not individual identities)
- Check if minimum quantity threshold is reached
- Aggregate statistics computed on encrypted data

## 🎬 Demo

**Live Demo**: [https://anonymous-sports-group-buying.vercel.app/](https://anonymous-sports-group-buying.vercel.app/)

**Demo Video**: [Watch AnonymousSportsGroupBuying.mp4](#) *(Coming soon)*

### What You'll See

1. **Connect Wallet**: Seamlessly connect your MetaMask to Sepolia testnet
2. **Browse Products**: View active group buying campaigns
3. **Place Orders**: Submit encrypted orders with complete privacy
4. **Track Orders**: Monitor your orders (only you can see the details)
5. **Create Campaigns**: Launch new group buying initiatives

## 🛠️ Technology Stack

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **Smart Contracts**: Solidity with Zama FHEVM
- **Encryption**: Fully Homomorphic Encryption (FHE)

### Frontend
- **Framework**: Vanilla JavaScript
- **Web3**: Ethers.js v5
- **Styling**: Custom CSS with modern UI/UX

### Privacy Layer
- **Encryption**: Zama fhEVM
- **Key Management**: On-chain FHE public keys
- **Decryption**: Oracle-based selective revelation

## 🚀 Getting Started

### Prerequisites
- MetaMask wallet installed
- Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))

### Quick Start

1. **Visit the Platform**
   ```
   https://anonymous-sports-group-buying.vercel.app/
   ```

2. **Connect Your Wallet**
   - Click "Connect Wallet"
   - Approve the connection in MetaMask
   - Switch to Sepolia testnet if prompted

3. **Browse & Purchase**
   - Browse available group buying campaigns
   - Enter your desired quantity (kept private!)
   - Submit your encrypted order

4. **Create Your Own Campaign**
   - Go to "Create Product" tab
   - Fill in product details
   - Set group buying parameters
   - Launch the campaign

## 📊 Use Cases

### For Individual Buyers
- **Bulk Discounts with Privacy**: Get group pricing without revealing purchase volume
- **Competitive Protection**: Keep procurement strategies confidential
- **Personal Privacy**: Prevent price discrimination based on buying patterns

### For Sports Teams
- **Equipment Procurement**: Order team gear without exposing team size
- **Budget Confidentiality**: Make bulk purchases without revealing budgets
- **Vendor Negotiations**: Leverage group buying without information leakage

### For Retailers
- **Anonymous Drop Shipping**: Facilitate bulk orders while protecting buyer privacy
- **Fair Competition**: All participants get equal pricing without favoritism
- **GDPR Compliance**: Enhanced privacy protection for EU customers

## 🔒 Security Features

### On-Chain Privacy
- All order data encrypted with FHE
- No plaintext sensitive information stored
- Cryptographically verifiable computations

### Access Control
- Only buyers can decrypt their own orders
- Contract owner cannot access individual order details
- Time-based reveal mechanisms for dispute resolution

### Smart Contract Security
- Built on Zama's audited FHE libraries
- Standard Solidity security patterns
- Upgradeable contract architecture for bug fixes

## 🌐 Links

- **Live Platform**: [https://anonymous-sports-group-buying.vercel.app/](https://anonymous-sports-group-buying.vercel.app/)
- **GitHub Repository**: [https://github.com/HoraceBarrows/AnonymousSportsGroupBuying](https://github.com/HoraceBarrows/AnonymousSportsGroupBuying)
- **Smart Contract**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431)
- **Zama FHEVM Docs**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)

## 🤝 Contributing

We welcome contributions from the community! Whether it's:
- Bug reports and fixes
- Feature suggestions
- Documentation improvements
- UI/UX enhancements

Please feel free to open issues or submit pull requests on our [GitHub repository](https://github.com/HoraceBarrows/AnonymousSportsGroupBuying).

## 📝 How It Works

### Step 1: Product Creation
A merchant or coordinator creates a group buying campaign:
```javascript
createProduct(name, description, unitPrice, minQuantity, maxQuantity, category, deadline)
```

### Step 2: Encrypted Order Submission
Buyers place orders with encrypted quantities:
```javascript
// Quantity is encrypted client-side before submission
placeOrder(productId, encryptedQuantity)
```

### Step 3: Privacy-Preserving Aggregation
The smart contract:
- Accumulates encrypted orders
- Computes total participants (public)
- Checks if minimum threshold reached (public)
- Keeps individual quantities private (encrypted)

### Step 4: Selective Revelation
When needed, buyers can:
- Decrypt their own order details
- Prove their participation
- Request refunds if minimum not met

## 🎓 Educational Resources

### Understanding FHE
Fully Homomorphic Encryption allows computations on encrypted data. In this platform:
- Addition of encrypted values (total quantity calculation)
- Comparison operations (threshold checks)
- Conditional logic (campaign success/failure)

All without ever decrypting sensitive user data!

### Privacy Benefits
Traditional group buying reveals:
- ❌ Individual purchase amounts
- ❌ Timing of purchases
- ❌ Coordination between buyers

FHE-based approach protects:
- ✅ Quantity privacy
- ✅ Amount privacy
- ✅ Participation patterns

## 🔮 Future Enhancements

- **Multi-tier Pricing**: Automatic price adjustments based on encrypted total quantity
- **Reputation System**: Privacy-preserving buyer/seller ratings
- **Cross-chain Support**: Expand to other EVM chains with FHE support
- **Mobile App**: Native mobile experience with WalletConnect
- **Advanced Analytics**: Zero-knowledge proofs for aggregate statistics

## ⚠️ Important Notes

- This is a testnet deployment for demonstration purposes
- Do not use real funds on mainnet without thorough auditing
- FHE operations may take longer than standard transactions
- Sepolia testnet required for full functionality

## 🙏 Acknowledgments

- **Zama**: For pioneering FHE technology and fhEVM
- **Ethereum Foundation**: For Sepolia testnet infrastructure
- **OpenZeppelin**: For secure smart contract libraries
- **Community**: For testing and feedback

---

**Built with ❤️ for a privacy-first future in e-commerce**

*Protecting your data, one encrypted transaction at a time.*
