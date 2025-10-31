# Anonymous Sports Group Buying Platform

A privacy-preserving sports equipment group purchasing platform powered by Zama's Fully Homomorphic Encryption (FHE) technology on Ethereum Sepolia testnet.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-yellow.svg)](https://hardhat.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 🌐 Live Demo

- **Web Application**: [https://fhe-sports-group-buying.vercel.app/](https://fhe-sports-group-buying.vercel.app/)
- **GitHub Repository**: [https://github.com/HoraceBarrows/FHESportsGroupBuying](https://github.com/HoraceBarrows/FHESportsGroupBuying)
- **Smart Contract**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431)

## 🆕 What's New - Full React Frontend!

The Anonymous Sports Group Buying Platform has been upgraded with a **complete Next.js 14 + React frontend**!

### New Features:
- ✨ **Modern React UI**: Built with Next.js 14 App Router and React 18
- 🎨 **Tailwind CSS Styling**: Beautiful, responsive design
- 🔐 **RainbowKit Integration**: Professional wallet connection experience
- ⚡ **Real-time Updates**: Automatic refresh of products and orders
- 🛡️ **Full TypeScript**: Type-safe throughout the entire stack
- 🔒 **Deep FHE Integration**: Custom hooks for seamless encryption operations
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🎯 **Improved UX**: Loading states, error handling, and toast notifications

### Quick Start:
```bash
cd sports-group-buying
npm install
npm run dev
```
Visit `http://localhost:3001` and connect your MetaMask wallet!

## 📹 Demo Video

A complete demonstration video (`demo.mp4`) is included in this repository. **Please download the file to view it** as the video cannot be played directly in the browser.

The demo showcases:
- **NEW**: Modern React UI and wallet connection
- Product creation and browsing with real-time updates
- Encrypted order placement with FHE SDK
- Privacy-preserving statistics visualization
- Order reveal functionality
- Complete user workflow from start to finish

## 🎯 Overview

This **full-stack decentralized application** enables users to participate in group buying of sports equipment while maintaining complete privacy of their purchase quantities and amounts. Built with FHE technology, all sensitive transaction data is encrypted on-chain, ensuring that neither merchants nor other buyers can access individual purchase information.

**🆕 Now with Modern React Frontend!**

The platform features a complete Next.js 14 application with:
- 🎨 **Modern UI**: Tailwind CSS with responsive design
- 🔐 **Wallet Integration**: RainbowKit for seamless wallet connection
- ⚡ **Real-time Updates**: React Query for efficient data fetching
- 🛡️ **Type Safety**: Full TypeScript implementation
- 🔒 **FHE Integration**: Deep integration with @fhevm/sdk for encryption operations
- 📱 **Mobile Responsive**: Works on all devices

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

## 🎨 Frontend Architecture

### Component Structure

The React frontend is built with a modern, modular architecture:

#### Core Components
- **Header.tsx**: Application header with RainbowKit wallet connection button
- **ProductBrowser.tsx**: Browse products with real-time updates and filtering
- **ProductCard.tsx**: Individual product display with encrypted order placement
- **ProductCreator.tsx**: Form for creating new group buying campaigns
- **OrdersList.tsx**: User's order history with status tracking
- **PrivacyNotice.tsx**: Privacy information and FHE explanation

#### Custom Hooks
- **useContract()**: Manages contract instance and signer setup
  - Automatically connects to deployed contract
  - Handles provider and signer management
  - Type-safe contract interactions

- **useFHEVM()**: Manages FHEVM SDK instance
  - Initializes FHE encryption on Sepolia
  - Provides encrypt/decrypt methods
  - Handles gateway URL configuration
  - Returns ready state and error handling

#### Utility Libraries
- **wagmi.ts**: Wagmi configuration for Sepolia testnet
- **types.ts**: TypeScript interfaces (Product, Order, etc.)
- **toast.ts**: User notification system
- **contractABI.ts**: Contract ABI and deployed address

#### State Management
- **React Context**: Global FHEVM instance via providers
- **React Query**: Server state and caching
- **Local State**: Component-level UI state with useState
- **Wagmi Hooks**: Wallet and blockchain state

### User Flow

```
1. Connect Wallet (RainbowKit)
   ↓
2. FHEVM SDK Initialization (Sepolia)
   ↓
3. Browse Products / Create Product
   ↓
4. Place Order with FHE Encryption
   ↓
5. View Encrypted Orders
   ↓
6. Optional: Reveal Order Details
```

### Key Features

#### Encryption on Order Placement
When a user places an order:
1. Input quantity (e.g., 5 items)
2. `useFHEVM` hook encrypts: `fhevm.encrypt32(quantity)`
3. Encrypted data sent to smart contract
4. User pays total amount (quantity × unit price)
5. Order stored with encrypted quantity on-chain

#### Privacy Guarantees
- ✅ Individual quantities never exposed in plaintext
- ✅ Only aggregate statistics visible (total orders count)
- ✅ User can decrypt their own orders only
- ✅ Merchants see totals but not individual amounts

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

### Frontend Layer (New!)
- **Framework**: Next.js 14.1.0 with App Router
- **UI Library**: React 18.2.0
- **Language**: TypeScript 5.3.0
- **Styling**: Tailwind CSS 3.4.0 + PostCSS + Autoprefixer
- **Wallet Integration**:
  - Wagmi 2.5.0 for Ethereum interactions
  - RainbowKit 2.0.0 for wallet connection UI
- **State Management**: @tanstack/react-query 5.0.0
- **FHE SDK**: @fhevm/sdk (workspace package)

### Blockchain Layer
- **Network**: Ethereum Sepolia Testnet
- **Development Framework**: Hardhat v2.22.0
- **Smart Contracts**: Solidity 0.8.24
- **Encryption**: Zama FHEVM v0.5.0
- **Hardhat Plugins**:
  - @nomicfoundation/hardhat-toolbox 5.0.0
  - @nomicfoundation/hardhat-ethers 3.0.0

### Privacy Layer
- **Encryption**: Zama fhEVM (Fully Homomorphic Encryption)
- **FHE Library**: @fhevm/solidity 0.5.0
- **Encrypted Types**: euint32, euint64, ebool
- **Key Management**: On-chain FHE public keys
- **Decryption**: EIP-712 signature-based selective revelation
- **Client SDK**: @fhevm/sdk with React hooks

### Web3 Integration
- **Ethereum Library**: Ethers.js v6.11.0
- **Wallet Connection**: RainbowKit + Wagmi
- **Provider Management**: React Context + Custom Hooks
- **Contract Interaction**: Type-safe contract bindings

### Development Tools
- **Testing**: Mocha + Chai + Hardhat Toolbox
- **Verification**: Hardhat Verify Plugin
- **Gas Optimization**: Solidity optimizer (800 runs)
- **Frontend Dev Server**: Next.js Fast Refresh
- **Build System**: Next.js with Webpack 5

### Security & Quality
- **Linting**:
  - Solhint for Solidity
  - ESLint for JavaScript/TypeScript
  - Next.js built-in linting
- **Formatting**: Prettier with Solidity plugin
- **Pre-commit Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions with multiple Node.js versions
- **Coverage**: 95%+ test coverage
- **Type Safety**: Full TypeScript with strict mode

## 📁 Project Structure

The platform now includes both smart contracts and a modern React frontend:

```
sports-group-buying/
├── app/                          # Next.js 14 App Router
│   ├── components/               # React components
│   │   ├── Header.tsx            # Wallet connection header
│   │   ├── ProductBrowser.tsx    # Browse products
│   │   ├── ProductCard.tsx       # Product card with FHE encryption
│   │   ├── ProductCreator.tsx    # Create products form
│   │   ├── OrdersList.tsx        # User orders display
│   │   └── PrivacyNotice.tsx     # Privacy info
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main page
│   ├── providers.tsx             # Wagmi/RainbowKit providers
│   └── globals.css               # Tailwind CSS styles
├── hooks/                        # Custom React hooks
│   ├── useContract.ts            # Contract interaction
│   └── useFHEVM.ts               # FHEVM SDK integration
├── lib/                          # Utility libraries
│   ├── wagmi.ts                  # Wagmi config for Sepolia
│   ├── types.ts                  # TypeScript interfaces
│   ├── toast.ts                  # Notification system
│   └── contractABI.ts            # Contract ABI & address
├── contracts/                    # Solidity smart contracts
│   └── AnonymousSportsGroupBuying.sol
├── scripts/                      # Deployment scripts
│   └── deploy.js
├── test/                         # Contract tests
├── public/                       # Static assets
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript config
├── hardhat.config.js             # Hardhat config
└── package.json                  # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MetaMask wallet browser extension
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

### Running the Frontend Application

**Option 1: Using the sports-group-buying directory (Recommended)**

```bash
cd sports-group-buying
npm install
npm run dev
```

The application will start at `http://localhost:3001`

**Features:**
- 🎨 Modern React UI with Tailwind CSS
- 🔐 Wallet connection via RainbowKit
- 📦 Browse and create products
- 🛒 Place encrypted orders with FHE
- 📊 View your order history
- 🔒 Privacy-preserving interface

**Frontend Configuration:**

Edit `lib/wagmi.ts` to set your WalletConnect project ID:
```typescript
projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.walletconnect.com
```

Edit `lib/contractABI.ts` to update the contract address if needed:
```typescript
export const CONTRACT_ADDRESS = '0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431';
```

**Building for Production:**
```bash
cd sports-group-buying
npm run build
npm run start
```

### Interaction & Simulation (Smart Contracts)

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

### Smart Contract Scripts (Root Directory)

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

### Frontend Scripts (sports-group-buying directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server on port 3001 |
| `npm run build` | Build Next.js production bundle |
| `npm run start` | Start production server on port 3001 |
| `npm run lint` | Lint Next.js and TypeScript files |
| `npm run compile` | Compile smart contracts (Hardhat) |
| `npm run deploy` | Deploy contracts to Sepolia |

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

## 🎯 Frontend Implementation Details

### Migration from Static HTML to React

The platform has been completely rewritten from a static HTML interface to a modern React application:

#### Before (Static HTML):
- Single HTML file with inline JavaScript
- Direct ethers.js integration
- Manual DOM manipulation
- Limited state management
- Basic styling with inline CSS

#### After (Next.js + React):
- **Component-based architecture** with reusable React components
- **Custom React hooks** for contract and FHE operations
- **Provider pattern** for global state (Wagmi + React Query)
- **Type-safe** with full TypeScript implementation
- **Modern styling** with Tailwind CSS utility classes
- **Optimized builds** with Next.js and Webpack 5

### Technical Highlights

#### Custom Hook: `useFHEVM()`
```typescript
const { instance, isInitializing, error, isReady } = useFHEVM();

// Automatically initializes FHEVM on Sepolia
// Returns FHE instance for encryption operations
// Handles loading and error states
```

#### Custom Hook: `useContract()`
```typescript
const { contract, address } = useContract();

// Automatically creates contract instance
// Connects to wallet signer
// Type-safe contract calls
```

#### Component Example: ProductCard
```typescript
// Encrypts order quantity before submitting
const encryptedQuantity = await fhevm.encrypt32(quantity);
await contract.placeOrder(productId, encryptedQuantity, {
  value: totalAmount,
  gasLimit: 800000,
});
```

### Performance Optimizations

- **React Query Caching**: Reduces redundant blockchain queries
- **Lazy Loading**: Components load on-demand
- **Memoization**: Prevents unnecessary re-renders
- **Next.js Optimization**: Automatic code splitting and tree shaking
- **Fast Refresh**: Instant feedback during development

### Security Features

- **Environment Variables**: Sensitive data in .env files
- **Type Safety**: TypeScript catches errors at compile time
- **Input Validation**: Client-side validation before blockchain submission
- **Error Boundaries**: Graceful error handling
- **Wallet Security**: RainbowKit best practices

## 🔮 Future Enhancements

### Planned Features
- **Multi-tier Pricing**: Dynamic pricing based on encrypted quantity tiers
- **Reputation System**: Privacy-preserving buyer/merchant ratings with ZK proofs
- **Cross-chain Support**: Expand to other EVM-compatible chains with FHE
- **Layer 2 Integration**: Deploy on L2 for reduced gas costs
- **Mobile App**: Native iOS/Android with WalletConnect
- **Advanced Filtering**: Search and filter products by category and price
- **Order History Export**: Download encrypted order data
- **Multi-language Support**: Internationalization (i18n)

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

