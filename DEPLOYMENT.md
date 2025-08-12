# Deployment Guide

Complete guide for deploying and verifying the Anonymous Sports Group Buying smart contract.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v16 or higher)
2. **MetaMask** wallet with Sepolia testnet configured
3. **Sepolia ETH** for deployment (get from [Sepolia Faucet](https://sepoliafaucet.com/))
4. **Infura Account** for RPC access (or alternative provider)
5. **Etherscan API Key** for contract verification

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and fill in your details:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **Security Warning**: Never commit your `.env` file or share your private key!

### 3. Compile Contracts

```bash
npm run compile
```

This will compile all Solidity contracts and generate artifacts.

### 4. Deploy to Sepolia

```bash
npm run deploy
```

The deployment script will:
- Deploy the `AnonymousSportsGroupBuying` contract
- Wait for confirmations
- Save deployment information to `deployments/sepolia.json`
- Display the contract address and transaction hash

**Expected Output:**
```
Starting deployment process...

Deploying contracts with account: 0x742d35Cc6634C0532925a3b8...
Account balance: 0.5 ETH

Deploying AnonymousSportsGroupBuying contract...
✅ Contract deployed to: 0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431
Deployment transaction hash: 0xabcd1234...
```

### 5. Verify Contract on Etherscan

```bash
npm run verify
```

This will verify your contract source code on Etherscan, making it publicly viewable and trustworthy.

**Expected Output:**
```
Starting contract verification...
Network: sepolia
Contract Address: 0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431

✅ Contract verified successfully!
View on Etherscan: https://sepolia.etherscan.io/address/0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431#code
```

## 🔍 Deployment Information

### Network Details

- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer**: https://sepolia.etherscan.io

### Contract Information

After successful deployment, you'll find:

**Contract Address**: Saved in `deployments/sepolia.json`

**Deployment File Structure**:
```json
{
  "network": "sepolia",
  "contractAddress": "0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431",
  "deployer": "0x742d35Cc6634C0532925a3b8...",
  "deploymentTxHash": "0xabcd1234...",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "blockNumber": 1234567,
  "chainId": "11155111"
}
```

### Etherscan Links

Once deployed and verified, you can view:

- **Contract Code**: `https://sepolia.etherscan.io/address/CONTRACT_ADDRESS#code`
- **Read Contract**: `https://sepolia.etherscan.io/address/CONTRACT_ADDRESS#readContract`
- **Write Contract**: `https://sepolia.etherscan.io/address/CONTRACT_ADDRESS#writeContract`

## 🧪 Testing Deployment

### Test with Interaction Script

```bash
npm run interact
```

This will:
- Connect to your deployed contract
- Display contract information
- Create a sample product
- Demonstrate basic interactions

### Run Full Simulation

```bash
npm run simulate
```

This automated script will:
- Create multiple products
- Place multiple orders from different accounts
- Generate comprehensive statistics
- Save results to `simulation-results/`

## 📊 Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Contract verified on Etherscan
- [ ] Deployment information saved
- [ ] Contract address updated in `.env`
- [ ] Basic interaction tested
- [ ] Frontend updated with new contract address (if applicable)
- [ ] Documentation updated

## 🛠️ Advanced Usage

### Deploy to Different Networks

To deploy to other networks, update `hardhat.config.js`:

```javascript
networks: {
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 1,
  },
  // Add more networks...
}
```

Then deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Custom Deployment

Modify `scripts/deploy.js` for custom deployment logic:

```javascript
// Example: Deploy with constructor arguments
const contract = await AnonymousSportsGroupBuying.deploy(
  arg1,
  arg2
);
```

### Gas Optimization

To estimate gas costs before deployment:

```bash
npx hardhat test --network hardhat
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: "Insufficient funds for gas"
- **Solution**: Add more Sepolia ETH to your deployment wallet

**Issue**: "Nonce too high"
- **Solution**: Reset your MetaMask account or adjust nonce manually

**Issue**: "Contract already verified"
- **Solution**: This is normal if you're re-running verification

**Issue**: "Invalid API Key"
- **Solution**: Double-check your Etherscan API key in `.env`

### Getting Help

- Check Hardhat documentation: https://hardhat.org/docs
- Zama FHEVM docs: https://docs.zama.ai/fhevm
- Etherscan verification guide: https://docs.etherscan.io/tutorials/verifying-contracts-programmatically

## 📝 Next Steps

After successful deployment:

1. **Update Frontend**: Update contract address in your frontend application
2. **Test Thoroughly**: Run all interaction scripts and simulations
3. **Monitor Contract**: Set up monitoring for contract events
4. **Document Changes**: Keep deployment log for reference
5. **Backup Keys**: Securely backup deployment information

## 🔒 Security Best Practices

1. **Never share private keys** - Keep them secure and encrypted
2. **Use separate wallets** - Different wallets for development and production
3. **Test first** - Always test on testnet before mainnet deployment
4. **Verify contracts** - Always verify source code on Etherscan
5. **Audit contracts** - Consider professional audits for mainnet deployments
6. **Monitor activity** - Set up alerts for unusual contract activity

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Hardhat and FHEVM documentation

---

**Last Updated**: January 2025
**Framework**: Hardhat v2.22.0
**Network**: Ethereum Sepolia Testnet
