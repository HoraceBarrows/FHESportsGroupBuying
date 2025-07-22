const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting contract interaction...\n");

  // Load deployment information
  const deploymentFile = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ No deployment file found for network: ${hre.network.name}`);
    console.log("Please deploy the contract first using: npm run deploy");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log("Network:", hre.network.name);
  console.log("Contract Address:", contractAddress);
  console.log("");

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("Interacting with account:", signer.address);
  console.log("");

  // Get contract instance
  const AnonymousSportsGroupBuying = await hre.ethers.getContractFactory("AnonymousSportsGroupBuying");
  const contract = AnonymousSportsGroupBuying.attach(contractAddress);

  // Display menu
  console.log("=".repeat(60));
  console.log("INTERACTION OPTIONS");
  console.log("=".repeat(60));
  console.log("1. Get Contract Info");
  console.log("2. Create a Product");
  console.log("3. Get Product Info");
  console.log("4. Place an Order");
  console.log("5. Get Order Info");
  console.log("6. Check Group Target Status");
  console.log("7. Get Product Statistics");
  console.log("=".repeat(60));
  console.log("");

  // Example 1: Get Contract Info
  console.log("📊 Getting contract information...");
  try {
    const owner = await contract.owner();
    const nextProductId = await contract.nextProductId();
    const nextOrderId = await contract.nextOrderId();

    console.log("Contract Owner:", owner);
    console.log("Next Product ID:", nextProductId.toString());
    console.log("Next Order ID:", nextOrderId.toString());
    console.log("");
  } catch (error) {
    console.error("Error getting contract info:", error.message);
  }

  // Example 2: Create a sample product
  console.log("🛍️  Creating a sample product...");
  try {
    const productName = "Premium Running Shoes";
    const productDescription = "High-performance running shoes for athletes";
    const unitPrice = hre.ethers.parseEther("0.01"); // 0.01 ETH
    const minOrderQuantity = 5;
    const maxOrderQuantity = 100;
    const category = 0; // FOOTWEAR
    const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days from now

    const tx = await contract.createProduct(
      productName,
      productDescription,
      unitPrice,
      minOrderQuantity,
      maxOrderQuantity,
      category,
      deadline
    );

    console.log("Transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Product created successfully!");

    // Get product ID from event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log).name === "ProductCreated";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      const productId = parsedEvent.args.productId;
      console.log("Product ID:", productId.toString());
      console.log("");

      // Get product info
      console.log("📋 Fetching product details...");
      const productInfo = await contract.getProductInfo(productId);
      console.log("Name:", productInfo.name);
      console.log("Description:", productInfo.description);
      console.log("Unit Price:", hre.ethers.formatEther(productInfo.unitPrice), "ETH");
      console.log("Min Order Quantity:", productInfo.minOrderQuantity.toString());
      console.log("Max Order Quantity:", productInfo.maxOrderQuantity.toString());
      console.log("Category:", productInfo.category.toString());
      console.log("Deadline:", new Date(Number(productInfo.deadline) * 1000).toLocaleString());
      console.log("Active:", productInfo.active);
      console.log("Current Orders:", productInfo.currentOrders.toString());
      console.log("Total Collected:", hre.ethers.formatEther(productInfo.totalCollected), "ETH");
      console.log("");
    }
  } catch (error) {
    console.error("Error creating product:", error.message);
    console.log("");
  }

  // Example 3: Get anonymous statistics
  console.log("📈 Example: Getting anonymous statistics for product ID 1...");
  try {
    const productId = 1;
    const stats = await contract.getAnonymousStats(productId);
    console.log("Total Participants:", stats.totalParticipants.toString());
    console.log("Target Reached:", stats.targetReached);
    console.log("");
  } catch (error) {
    console.log("Note: Product ID 1 might not exist yet");
    console.log("");
  }

  // Display instructions
  console.log("=".repeat(60));
  console.log("NEXT STEPS");
  console.log("=".repeat(60));
  console.log("1. Modify this script to perform specific interactions");
  console.log("2. Place orders using the placeOrder function");
  console.log("3. Check order status with getOrderInfo");
  console.log("4. Process group orders when target is reached");
  console.log("5. Use the simulation script for automated testing");
  console.log("=".repeat(60));
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Interaction failed:");
    console.error(error);
    process.exit(1);
  });
