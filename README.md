# Anonymous Sports Group Buying Platform

A privacy-preserving sports equipment group purchasing platform powered by Zama's Fully Homomorphic Encryption (FHE) technology on Ethereum Sepolia testnet.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-yellow.svg)](https://hardhat.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

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

### Contract Information

**Network**: Sepolia Testnet
**Contract Address**: `0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431`
**Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431)

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

## 🛠️ Technology Stack

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **Development Framework**: Hardhat v2.22.0
- **Smart Contracts**: Solidity 0.8.24
- **Encryption**: Zama FHEVM

### Development Tools
- **Testing**: Hardhat Toolbox
- **Verification**: Hardhat Verify Plugin
- **Web3 Library**: Ethers.js v6

### Privacy Layer
- **Encryption**: Zama fhEVM
- **Key Management**: On-chain FHE public keys
- **Decryption**: Oracle-based selective revelation

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or higher
- MetaMask wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))
- Infura account (or alternative RPC provider)
- Etherscan API key (for contract verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HoraceBarrows/AnonymousSportsGroupBuying.git
   cd AnonymousSportsGroupBuying
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key
   CONTRACT_ADDRESS=0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431
   ```

### Compilation

Compile the smart contracts:

```bash
npm run compile
```

This generates contract artifacts and TypeScript bindings.

### Deployment

Deploy to Sepolia testnet:

```bash
npm run deploy
```

The deployment script will:
- Deploy the contract
- Wait for confirmations
- Save deployment info to `deployments/sepolia.json`
- Display contract address and Etherscan link

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Verification

Verify the contract on Etherscan:

```bash
npm run verify
```

### Testing & Interaction

**Run interaction script:**
```bash
npm run interact
```

**Run full simulation:**
```bash
npm run simulate
```

The simulation script will create multiple products and orders, demonstrating the full functionality.

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
- Comprehensive test coverage

## 📝 Smart Contract Functions

### Product Management

```solidity
// Create a new group buying product
function createProduct(
    string memory name,
    string memory description,
    uint256 unitPrice,
    uint256 minOrderQuantity,
    uint256 maxOrderQuantity,
    ProductCategory category,
    uint256 deadline
) external returns (uint256)

// Deactivate a product
function deactivateProduct(uint256 productId) external

// Get product information
function getProductInfo(uint256 productId) external view returns (...)
```

### Order Management

```solidity
// Place an encrypted order
function placeOrder(uint256 productId, uint32 quantity) external payable

// Cancel an order
function cancelOrder(uint256 orderId) external

// Reveal order details
function revealOrder(uint256 orderId) external

// Get order information
function getOrderInfo(uint256 orderId) external view returns (...)
```

### Group Order Processing

```solidity
// Check if group target is reached
function checkGroupTarget(uint256 productId) public view returns (bool)

// Process group order
function processGroupOrder(uint256 productId) external

// Get anonymous statistics
function getAnonymousStats(uint256 productId) external view returns (...)
```

## 📋 Deployment Information

### Current Deployment

- **Network**: Sepolia Testnet
- **Contract Address**: `0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431`
- **Deployer**: See `deployments/sepolia.json`
- **Block Number**: See deployment file
- **Transaction Hash**: See deployment file

### Etherscan Links

- **Contract Code**: [View Source](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431#code)
- **Read Contract**: [Read Functions](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431#readContract)
- **Write Contract**: [Write Functions](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431#writeContract)

## 📚 Scripts

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Compile | `npm run compile` | Compile smart contracts |
| Deploy | `npm run deploy` | Deploy to Sepolia testnet |
| Verify | `npm run verify` | Verify on Etherscan |
| Interact | `npm run interact` | Interact with deployed contract |
| Simulate | `npm run simulate` | Run automated simulation |
| Test | `npm run test` | Run test suite |
| Clean | `npm run clean` | Clean artifacts and cache |

### Script Descriptions

**deploy.js**: Deploys the contract and saves deployment information
**verify.js**: Verifies the contract source code on Etherscan
**interact.js**: Demonstrates basic contract interactions
**simulate.js**: Runs comprehensive automated testing with multiple products and orders

## 🤝 Contributing

We welcome contributions from the community! Whether it's:
- Bug reports and fixes
- Feature suggestions
- Documentation improvements
- UI/UX enhancements

Please feel free to open issues or submit pull requests.

## 📝 How It Works

### Step 1: Product Creation
A merchant or coordinator creates a group buying campaign:
```javascript
await contract.createProduct(
    "Premium Running Shoes",
    "High-performance shoes",
    ethers.parseEther("0.01"),
    5,  // minimum quantity
    100, // maximum quantity
    0,  // category (FOOTWEAR)
    deadline
);
```

### Step 2: Encrypted Order Submission
Buyers place orders with encrypted quantities:
```javascript
const quantity = 10;
const totalAmount = unitPrice * quantity;
await contract.placeOrder(productId, quantity, { value: totalAmount });
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

## 🌐 Links

- **GitHub Repository**: [Anonymous Sports Group Buying](https://github.com/HoraceBarrows/AnonymousSportsGroupBuying)
- **Smart Contract**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431)
- **Zama FHEVM Docs**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Hardhat Docs**: [https://hardhat.org/docs](https://hardhat.org/docs)

## 🙏 Acknowledgments

- **Zama**: For pioneering FHE technology and fhEVM
- **Ethereum Foundation**: For Sepolia testnet infrastructure
- **Hardhat Team**: For excellent development tools
- **Community**: For testing and feedback

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built for a privacy-first future in e-commerce**

*Protecting your data, one encrypted transaction at a time.*
