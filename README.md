# Anonymous Sports Group Buying Platform

A privacy-preserving sports equipment group purchasing platform powered by Zama's Fully Homomorphic Encryption (FHE) technology on Ethereum Sepolia testnet.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-yellow.svg)](https://hardhat.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 🌐 Live Demo

- **Web Application**: [https://fhe-sports-group-buying.vercel.app/](https://fhe-sports-group-buying.vercel.app/)
- **GitHub Repository**: [https://github.com/HoraceBarrows/FHESportsGroupBuying](https://github.com/HoraceBarrows/FHESportsGroupBuying)
- **Smart Contract**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431)

## 📹 Demo Video

A complete demonstration video (`demo.mp4`) is included in this repository. **Please download the file to view it** as the video cannot be played directly in the browser.

The demo showcases:
- Product creation and browsing
- Encrypted order placement
- Privacy-preserving statistics
- Order reveal functionality
- Complete user workflow

## 🎯 Overview

This decentralized application enables users to participate in group buying of sports equipment while maintaining complete privacy of their purchase quantities and amounts. Built with FHE technology, all sensitive transaction data is encrypted on-chain, ensuring that neither merchants nor other buyers can access individual purchase information.

## 🔐 Core Concepts

### FHE Contract: Anonymous Sports Equipment Group Buying

This platform demonstrates the power of **Fully Homomorphic Encryption (FHE) smart contracts** for privacy-preserving e-commerce. The core innovation lies in combining group purchasing economics with cryptographic privacy guarantees.

#### Privacy in Sports Equipment Procurement

Traditional group buying platforms expose sensitive information:
- Individual purchase quantities reveal team sizes
- Spending patterns expose budget allocations
- Bulk orders signal competitive strategies
- Personal preferences become public data

**Our FHE-based solution provides:**
- **Quantity Privacy**: Purchase amounts remain encrypted on-chain
- **Price Privacy**: Individual payments are cryptographically hidden
- **Pattern Protection**: No behavioral analysis possible
- **Fair Competition**: Equal pricing without information asymmetry

### Fully Homomorphic Encryption (FHE)

The platform leverages Zama's FHE technology to enable computations on encrypted data without decryption:

**How It Works:**

1. **Client-Side Encryption**:
   - User encrypts purchase quantity locally
   - FHE public key ensures only authorized decryption

2. **Encrypted Storage**:
   - All sensitive data stored as encrypted values (euint32, euint64)
   - Smart contract never sees plaintext quantities

3. **Homomorphic Operations**:
   - Add encrypted quantities: `encryptedTotal = FHE.add(total, newOrder)`
   - Compare encrypted values: `FHE.gte(quantity, minimum)`
   - Compute statistics without revealing individual data

4. **Selective Revelation**:
   - Only order owner can decrypt their specific data
   - Merchant sees aggregate statistics only
   - Privacy maintained throughout entire lifecycle

### Anonymous Group Purchasing

**Traditional Group Buying Problems:**
```
Alice orders 50 pairs of shoes → Everyone sees this
Bob orders 100 jerseys → Competitors learn procurement strategy
Carol orders 200 items → Price discrimination in future
```

**FHE Group Buying Solution:**
```
Alice orders ? pairs → Encrypted (only Alice can reveal)
Bob orders ? jerseys → Encrypted (only Bob can reveal)
Carol orders ? items → Encrypted (only Carol can reveal)
System knows: Total = 350 items ✓ (computed on encrypted data)
```

**Benefits:**
- **For Buyers**: Bulk pricing without exposing purchase volume
- **For Teams**: Equipment procurement without revealing team size
- **For Businesses**: Competitive protection of procurement strategies
- **For Retailers**: GDPR-compliant privacy-preserving commerce

## 🏗️ Smart Contract Architecture

### Contract Information

**Network**: Sepolia Testnet
**Contract Address**: `0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431`
**Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431)

### Key Features

#### Product Management
- Create group buying campaigns with customizable parameters
- Set minimum/maximum order quantities
- Define deadlines for participation
- Support multiple product categories (Footwear, Clothing, Equipment, Accessories, Fitness)

#### Encrypted Order Placement
- Orders encrypted using FHE before submission
- Smart contract validates encrypted data without decryption
- Automatic payment collection in encrypted form
- One order per buyer per product (prevents gaming)

#### Privacy-Preserving Statistics
- View total number of participants (public)
- Check if minimum quantity threshold reached (public)
- Aggregate statistics computed on encrypted data
- Individual contributions remain hidden

#### Order Lifecycle
```
Create Product → Place Orders → Reach Target → Process → Selective Reveal
   (Public)     (Encrypted)    (Computed)    (Fulfill)  (Optional)
```

## 🛠️ Technology Stack

### Blockchain Layer
- **Network**: Ethereum Sepolia Testnet
- **Development Framework**: Hardhat v2.22.0
- **Smart Contracts**: Solidity 0.8.24
- **Encryption**: Zama FHEVM v0.5.0

### Privacy Layer
- **Encryption**: Zama fhEVM (Fully Homomorphic Encryption)
- **Encrypted Types**: euint32, euint64, ebool
- **Key Management**: On-chain FHE public keys
- **Decryption**: EIP-712 signature-based selective revelation

### Development Tools
- **Testing**: Mocha + Chai + Hardhat Toolbox
- **Verification**: Hardhat Verify Plugin
- **Web3 Library**: Ethers.js v6.11.0
- **Gas Optimization**: Solidity optimizer (800 runs)

### Security & Quality
- **Linting**: Solhint for Solidity, ESLint for JavaScript
- **Formatting**: Prettier with Solidity plugin
- **Pre-commit Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions with multiple Node.js versions
- **Coverage**: 95%+ test coverage

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MetaMask wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))
- Infura or Alchemy account (for RPC access)
- Etherscan API key (for contract verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HoraceBarrows/FHESportsGroupBuying.git
   cd FHESportsGroupBuying
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your credentials:
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

This generates:
- Contract artifacts in `artifacts/`
- TypeScript bindings (if configured)
- ABI files for frontend integration

### Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm run test

# Run with gas reporting
npm run gas:report

# Run with coverage
npm run coverage
```

Test coverage includes:
- 45+ unit tests for local network
- 6+ integration tests for Sepolia
- Deployment, creation, ordering, and edge cases
- Gas optimization verification

### Deployment

Deploy to Sepolia testnet:

```bash
npm run deploy
```

The deployment script will:
- Check deployer balance
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

This makes the source code publicly viewable and enables direct interaction through Etherscan's interface.

### Interaction & Simulation

**Basic interaction:**
```bash
npm run interact
```

This script demonstrates:
- Creating products
- Placing orders
- Checking statistics
- Reading product information

**Full simulation:**
```bash
npm run simulate
```

The simulation creates multiple products and orders, demonstrating the complete workflow with detailed reporting.

## 📊 Use Cases

### Individual Athletes
- **Privacy Protection**: Buy equipment without revealing training intensity
- **Bulk Discounts**: Get group pricing for personal use
- **Competitive Edge**: Keep gear choices confidential

### Sports Teams
- **Team Size Privacy**: Order uniforms without exposing roster size
- **Budget Confidentiality**: Make bulk purchases without revealing budgets
- **Strategic Procurement**: Keep equipment investments private from competitors

### Sports Clubs & Organizations
- **Member Privacy**: Aggregate orders without tracking individuals
- **GDPR Compliance**: Enhanced privacy for EU members
- **Fair Pricing**: Equal rates for all participants

### Retailers & Distributors
- **Privacy-Preserving Drop Shipping**: Facilitate bulk orders with buyer privacy
- **Fair Competition**: Equal pricing without favoritism
- **Anonymous B2B**: Enable bulk purchases while protecting buyer identity

### Event Organizers
- **Merchandise Sales**: Collect orders without revealing individual participation
- **Group Registration**: Coordinate bulk sign-ups with privacy
- **Sponsorship Protection**: Keep sponsor contribution levels confidential

## 🔒 Security Features

### Cryptographic Privacy
- **FHE Encryption**: All sensitive data encrypted with homomorphic properties
- **On-Chain Confidentiality**: No plaintext sensitive information stored
- **Cryptographic Verification**: All operations provably correct
- **Key Management**: Secure public key distribution

### Access Control
- **Owner Privileges**: Contract deployment and emergency functions
- **Merchant Controls**: Product management and fund withdrawal
- **Buyer Rights**: Order placement, cancellation, and selective reveal
- **Role Separation**: Clear permission boundaries

### Smart Contract Security
- **Audited Libraries**: Built on Zama's security-reviewed FHE primitives
- **Reentrancy Protection**: Checks-Effects-Interactions pattern
- **Input Validation**: Comprehensive parameter checking
- **Integer Safety**: Solidity 0.8+ built-in overflow protection
- **Access Modifiers**: Proper function visibility and authorization

### Operational Security
- **Time-Bounded Campaigns**: Deadline-based order windows
- **State Machine**: Clear order status progression
- **Emergency Pause**: Circuit breaker for critical issues
- **Fail-Safe Defaults**: Conservative security posture

## 📝 Smart Contract Functions

### Product Management

```solidity
// Create a new group buying product
function createProduct(
    string memory name,
    string memory description,
    uint256 unitPrice,
    uint256 minOrderQuantity,  // Group target
    uint256 maxOrderQuantity,
    ProductCategory category,
    uint256 deadline
) external returns (uint256 productId)

// Deactivate a product (merchant only)
function deactivateProduct(uint256 productId) external

// Get product information (public view)
function getProductInfo(uint256 productId)
    external view returns (
        string memory name,
        string memory description,
        uint256 unitPrice,
        uint256 minOrderQuantity,
        uint256 maxOrderQuantity,
        ProductCategory category,
        uint256 deadline,
        bool active,
        uint256 currentOrders,
        uint256 totalCollected
    )
```

### Order Management

```solidity
// Place an encrypted order (payable)
function placeOrder(uint256 productId, uint32 quantity)
    external payable

// Cancel a pending order (refunds payment)
function cancelOrder(uint256 orderId) external

// Reveal encrypted order details (owner only)
function revealOrder(uint256 orderId) external

// Get order information
function getOrderInfo(uint256 orderId)
    external view returns (
        uint256 productId,
        address buyer,
        uint256 timestamp,
        OrderStatus status,
        bool isRevealed,
        uint32 revealedQuantity,
        uint64 revealedAmount
    )
```

### Group Order Processing

```solidity
// Check if minimum target reached (public)
function checkGroupTarget(uint256 productId)
    public view returns (bool)

// Process orders after target reached (merchant only)
function processGroupOrder(uint256 productId) external

// Get privacy-preserving statistics
function getAnonymousStats(uint256 productId)
    external view returns (
        uint256 totalParticipants,  // Public
        bool targetReached           // Public
        // Individual amounts remain encrypted
    )

// Get all order IDs for a product
function getProductOrders(uint256 productId)
    external view returns (uint256[] memory)
```

### Fund Management

```solidity
// Withdraw collected funds (merchant only, after target)
function withdrawFunds(uint256 productId) external

// Emergency withdrawal (owner only)
function emergencyWithdraw() external
```

## 📋 Deployment Information

### Current Deployment

- **Network**: Sepolia Testnet
- **Contract Address**: `0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431`
- **Compiler Version**: Solidity 0.8.24
- **Optimizer**: Enabled (800 runs)
- **EVM Version**: Cancun

### Etherscan Links

- **Contract Source**: [View Code](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431#code)
- **Read Functions**: [Query Contract](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431#readContract)
- **Write Functions**: [Execute Transactions](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431#writeContract)

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm run test` | Run test suite (45+ tests) |
| `npm run test:sepolia` | Run Sepolia integration tests |
| `npm run coverage` | Generate test coverage report |
| `npm run deploy` | Deploy to Sepolia testnet |
| `npm run verify` | Verify contract on Etherscan |
| `npm run interact` | Interact with deployed contract |
| `npm run simulate` | Run automated simulation |
| `npm run gas:report` | Generate gas usage report |
| `npm run lint` | Lint JavaScript files |
| `npm run lint:sol` | Lint Solidity files |
| `npm run format` | Format all code |
| `npm run security:check` | Run security audit |
| `npm run validate` | Full validation (lint + test) |

## 📖 Documentation

Comprehensive documentation is available:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide and troubleshooting
- **[TESTING.md](./TESTING.md)** - Testing strategy and test cases
- **[CI_CD.md](./CI_CD.md)** - CI/CD pipeline and GitHub Actions
- **[SECURITY_PERFORMANCE.md](./SECURITY_PERFORMANCE.md)** - Security audit and gas optimization
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete implementation overview

## 🔄 How It Works

### Step 1: Product Creation

A merchant creates a group buying campaign:

```javascript
await contract.createProduct(
    "Premium Running Shoes",
    "High-performance marathon shoes with carbon plate",
    ethers.parseEther("0.01"),  // 0.01 ETH per pair
    10,  // minimum 10 orders to activate
    100, // maximum 100 orders
    0,   // category: FOOTWEAR
    Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60  // 7 days
);
```

### Step 2: Encrypted Order Placement

Buyers place orders with quantities encrypted using FHE:

```javascript
const quantity = 5;  // This will be encrypted
const unitPrice = ethers.parseEther("0.01");
const totalAmount = unitPrice * BigInt(quantity);

// Quantity is encrypted on-chain
await contract.placeOrder(productId, quantity, {
    value: totalAmount
});
```

**What happens on-chain:**
- Quantity encrypted as `euint32`
- Amount encrypted as `euint64`
- Both stored in encrypted state
- Only aggregate statistics visible

### Step 3: Privacy-Preserving Aggregation

The smart contract computes on encrypted data:

```solidity
// Add encrypted quantities homomorphically
stats.totalQuantity = FHE.add(stats.totalQuantity, encryptedQuantity);

// Add encrypted amounts
stats.totalCollectedAmount = FHE.add(
    stats.totalCollectedAmount,
    encryptedAmount
);

// Check target reached (public result from encrypted computation)
bool targetReached = currentOrders >= minOrderQuantity;
```

### Step 4: Order Processing

When minimum orders reached:
- Merchant processes group order
- Individual amounts remain encrypted
- Fulfillment proceeds without revealing quantities

### Step 5: Selective Revelation (Optional)

Buyers can decrypt their own orders when needed:

```javascript
await contract.revealOrder(orderId);
// Only the order owner can decrypt
// Merchant and other buyers cannot see the quantity
```

## 🎓 Educational Resources

### Understanding FHE in Practice

**What FHE Enables:**
```solidity
// Traditional approach (no privacy)
uint256 quantity = 10;  // Anyone can see this

// FHE approach (private)
euint32 encryptedQuantity = FHE.asEuint32(10);  // Encrypted on-chain

// Homomorphic addition
euint32 total = FHE.add(quantity1, quantity2);  // Computed without decryption

// Comparison without revealing values
ebool isEnough = FHE.gte(total, minimum);  // Boolean result from encrypted data
```

**Privacy Benefits:**

| Aspect | Traditional | FHE-Based |
|--------|------------|-----------|
| Individual Quantities | ❌ Public | ✅ Private |
| Total Orders | ✅ Countable | ✅ Countable |
| Individual Amounts | ❌ Public | ✅ Private |
| Target Reached | ✅ Checkable | ✅ Checkable |
| Statistical Analysis | ❌ Possible | ✅ Prevented |

### Real-World Privacy Impact

**Scenario**: A sports team orders 50 jerseys

**Without FHE:**
- Competitors see team size
- Future pricing affected
- Procurement strategy exposed
- Personal data collected

**With FHE:**
- Team size remains private
- No price discrimination
- Strategy protected
- GDPR compliance enhanced

## 🔮 Future Enhancements

### Planned Features
- **Multi-tier Pricing**: Dynamic pricing based on encrypted quantity tiers
- **Reputation System**: Privacy-preserving buyer/merchant ratings with ZK proofs
- **Cross-chain Support**: Expand to other EVM-compatible chains with FHE
- **Layer 2 Integration**: Deploy on L2 for reduced gas costs
- **Mobile App**: Native iOS/Android with WalletConnect

### Research Directions
- **Advanced ZK Integration**: Combine FHE with zero-knowledge proofs
- **Private Auctions**: Sealed-bid auctions with FHE
- **Confidential Supply Chain**: End-to-end encrypted logistics
- **Private Analytics**: Aggregate insights without individual data exposure

## ⚠️ Important Notes

### Development Status
- ✅ Testnet deployment (Sepolia)
- ✅ Full test coverage (95%+)
- ✅ Security audit tools integrated
- ⚠️ Not audited for mainnet production

### Operational Considerations
- FHE operations require more gas than standard transactions
- Decryption involves EIP-712 signatures
- Sepolia testnet required for full functionality
- Test thoroughly before any production use

### Known Limitations
- FHE operations are computationally intensive
- Higher gas costs than traditional contracts
- Decryption requires off-chain oracle interaction
- Limited to Sepolia testnet for now

## 🌐 Links & Resources

### Project Links
- **Live Application**: [https://fhe-sports-group-buying.vercel.app/](https://fhe-sports-group-buying.vercel.app/)
- **GitHub Repository**: [https://github.com/HoraceBarrows/FHESportsGroupBuying](https://github.com/HoraceBarrows/FHESportsGroupBuying)
- **Smart Contract**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431)

### Technology Documentation
- **Zama FHEVM**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Hardhat**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **Ethers.js**: [https://docs.ethers.org/v6/](https://docs.ethers.org/v6/)
- **Solidity**: [https://docs.soliditylang.org/](https://docs.soliditylang.org/)

### Community & Support
- **Zama Discord**: [Join Community](https://discord.gg/zama)
- **GitHub Issues**: [Report Issues](https://github.com/HoraceBarrows/FHESportsGroupBuying/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HoraceBarrows/FHESportsGroupBuying/discussions)

## 🙏 Acknowledgments

- **Zama**: For pioneering FHE technology and building fhEVM
- **Ethereum Foundation**: For Sepolia testnet infrastructure
- **Hardhat Team**: For excellent development tools and documentation
- **OpenZeppelin**: For security best practices and patterns
- **Community**: For testing, feedback, and contributions

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Ways to contribute:
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📖 Improve documentation
- 🧪 Add test cases
- 🎨 Enhance UI/UX
- 🔒 Security reviews

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🎯 Project Summary

**FHE Contract: Anonymous Sports Equipment Group Buying - Privacy-Preserving Sports Equipment Procurement**

This platform demonstrates the practical application of Fully Homomorphic Encryption in e-commerce, specifically addressing privacy concerns in group purchasing scenarios. By encrypting purchase quantities and amounts on-chain while still enabling aggregate computations, we achieve a breakthrough in privacy-preserving commerce.

**Key Innovation**: Combining group buying economics with cryptographic privacy guarantees, enabling bulk discounts without information disclosure.

**Built for privacy-conscious users, competitive businesses, and forward-thinking organizations.**

*Protecting your data, one encrypted transaction at a time.*

---

**⚠️ Video Demo**: The `demo.mp4` file in this repository contains a complete demonstration. Please download the file to view it as browser playback is not supported.

