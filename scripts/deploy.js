const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment process...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    throw new Error("Deployer account has no ETH. Please fund the account first.");
  }

  // Deploy the contract
  console.log("Deploying AnonymousSportsGroupBuying contract...");
  const AnonymousSportsGroupBuying = await hre.ethers.getContractFactory("AnonymousSportsGroupBuying");

  const contract = await AnonymousSportsGroupBuying.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ Contract deployed to:", contractAddress);

  // Get deployment transaction
  const deploymentTx = contract.deploymentTransaction();
  console.log("Deployment transaction hash:", deploymentTx.hash);

  // Wait for confirmations
  console.log("\nWaiting for confirmations...");
  await deploymentTx.wait(3);
  console.log("✅ Confirmed!\n");

  // Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTxHash: deploymentTx.hash,
    timestamp: new Date().toISOString(),
    blockNumber: deploymentTx.blockNumber,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
  };

  const deploymentDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile);

  // Display deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Transaction Hash:", deploymentTx.hash);
  console.log("Block Number:", deploymentTx.blockNumber);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("=".repeat(60));

  // Display next steps
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Verify the contract:");
  console.log(`   npm run verify`);
  console.log("\n2. Interact with the contract:");
  console.log(`   npm run interact`);
  console.log("\n3. Update your .env file with:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);

  if (hre.network.name === "sepolia") {
    console.log("\n4. View on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  }
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
