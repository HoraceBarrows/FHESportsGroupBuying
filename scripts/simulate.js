const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Simulation configuration
const SIMULATION_CONFIG = {
  numProducts: 2,
  numOrders: 10,
  minQuantity: 1,
  maxQuantity: 10,
};

async function main() {
  console.log("Starting automated simulation...\n");
  console.log("=".repeat(60));
  console.log("SIMULATION CONFIGURATION");
  console.log("=".repeat(60));
  console.log("Number of products to create:", SIMULATION_CONFIG.numProducts);
  console.log("Number of orders to place:", SIMULATION_CONFIG.numOrders);
  console.log("Quantity range:", SIMULATION_CONFIG.minQuantity, "-", SIMULATION_CONFIG.maxQuantity);
  console.log("=".repeat(60));
  console.log("");

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

  // Get signers
  const signers = await hre.ethers.getSigners();
  const owner = signers[0];
  console.log("Owner account:", owner.address);
  console.log("");

  // Get contract instance
  const AnonymousSportsGroupBuying = await hre.ethers.getContractFactory("AnonymousSportsGroupBuying");
  const contract = AnonymousSportsGroupBuying.attach(contractAddress);

  // Product templates
  const productTemplates = [
    {
      name: "Elite Basketball Shoes",
      description: "Professional-grade basketball shoes with advanced cushioning",
      category: 0, // FOOTWEAR
    },
    {
      name: "Performance Training Gear",
      description: "Complete training outfit for serious athletes",
      category: 1, // CLOTHING
    },
    {
      name: "Smart Fitness Tracker",
      description: "Advanced fitness tracking with AI-powered insights",
      category: 4, // FITNESS
    },
    {
      name: "Premium Gym Equipment",
      description: "Professional-grade gym equipment for home use",
      category: 2, // EQUIPMENT
    },
  ];

  const createdProductIds = [];

  // Step 1: Create products
  console.log("📦 STEP 1: Creating products...\n");
  for (let i = 0; i < SIMULATION_CONFIG.numProducts; i++) {
    const template = productTemplates[i % productTemplates.length];
    const unitPrice = hre.ethers.parseEther((0.01 + Math.random() * 0.09).toFixed(4)); // 0.01-0.1 ETH
    const minOrderQuantity = 5 + Math.floor(Math.random() * 5); // 5-9
    const maxOrderQuantity = 50 + Math.floor(Math.random() * 50); // 50-99
    const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days

    console.log(`Creating product ${i + 1}/${SIMULATION_CONFIG.numProducts}...`);
    console.log(`  Name: ${template.name}`);
    console.log(`  Price: ${hre.ethers.formatEther(unitPrice)} ETH`);
    console.log(`  Min Quantity: ${minOrderQuantity}`);

    try {
      const tx = await contract.createProduct(
        template.name,
        template.description,
        unitPrice,
        minOrderQuantity,
        maxOrderQuantity,
        template.category,
        deadline
      );

      const receipt = await tx.wait();

      // Extract product ID from event
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
        createdProductIds.push(productId);
        console.log(`  ✅ Created with ID: ${productId.toString()}`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to create product: ${error.message}`);
    }
    console.log("");
  }

  if (createdProductIds.length === 0) {
    console.error("❌ No products were created. Exiting simulation.");
    process.exit(1);
  }

  // Step 2: Place orders
  console.log("\n🛒 STEP 2: Placing orders...\n");

  const ordersPlaced = [];

  for (let i = 0; i < SIMULATION_CONFIG.numOrders; i++) {
    // Randomly select a product
    const productId = createdProductIds[Math.floor(Math.random() * createdProductIds.length)];

    // Get product info to calculate payment
    const productInfo = await contract.getProductInfo(productId);

    // Random quantity
    const quantity = SIMULATION_CONFIG.minQuantity +
                    Math.floor(Math.random() * (SIMULATION_CONFIG.maxQuantity - SIMULATION_CONFIG.minQuantity + 1));

    // Calculate payment
    const totalAmount = productInfo.unitPrice * BigInt(quantity);

    // Use different signers if available
    const buyerIndex = i % Math.min(signers.length, 10);
    const buyer = signers[buyerIndex];

    console.log(`Placing order ${i + 1}/${SIMULATION_CONFIG.numOrders}...`);
    console.log(`  Buyer: ${buyer.address}`);
    console.log(`  Product ID: ${productId.toString()}`);
    console.log(`  Quantity: ${quantity}`);
    console.log(`  Total: ${hre.ethers.formatEther(totalAmount)} ETH`);

    try {
      // Check if already ordered
      const hasOrdered = await contract.hasOrdered(productId, buyer.address);
      if (hasOrdered) {
        console.log(`  ⏭️  Buyer already ordered this product, skipping...`);
        console.log("");
        continue;
      }

      const tx = await contract.connect(buyer).placeOrder(productId, quantity, {
        value: totalAmount,
      });

      const receipt = await tx.wait();

      // Extract order ID from event
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log).name === "OrderPlaced";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        const orderId = parsedEvent.args.orderId;
        ordersPlaced.push({ orderId, productId, buyer: buyer.address });
        console.log(`  ✅ Order placed with ID: ${orderId.toString()}`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to place order: ${error.message}`);
    }
    console.log("");
  }

  // Step 3: Display statistics
  console.log("\n📊 STEP 3: Analyzing results...\n");
  console.log("=".repeat(60));
  console.log("SIMULATION RESULTS");
  console.log("=".repeat(60));

  for (const productId of createdProductIds) {
    const productInfo = await contract.getProductInfo(productId);
    const stats = await contract.getAnonymousStats(productId);

    console.log(`\nProduct ID: ${productId.toString()}`);
    console.log(`  Name: ${productInfo.name}`);
    console.log(`  Total Participants: ${stats.totalParticipants.toString()}`);
    console.log(`  Current Orders: ${productInfo.currentOrders.toString()}`);
    console.log(`  Min Required: ${productInfo.minOrderQuantity.toString()}`);
    console.log(`  Total Collected: ${hre.ethers.formatEther(productInfo.totalCollected)} ETH`);
    console.log(`  Target Reached: ${stats.targetReached ? "Yes ✅" : "No ❌"}`);

    // Check if target can be processed
    const canProcess = await contract.checkGroupTarget(productId);
    console.log(`  Can Process: ${canProcess ? "Yes ✅" : "No ❌"}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log(`Total Products Created: ${createdProductIds.length}`);
  console.log(`Total Orders Placed: ${ordersPlaced.length}`);
  console.log("=".repeat(60));

  // Step 4: Provide next steps
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Process group orders that reached their target");
  console.log("2. Reveal orders using the revealOrder function");
  console.log("3. Withdraw funds as merchant");
  console.log("4. Monitor order status changes");
  console.log("");

  // Save simulation results
  const resultsDir = path.join(__dirname, "..", "simulation-results");
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/:/g, "-").split(".")[0];
  const resultsFile = path.join(resultsDir, `simulation-${timestamp}.json`);

  const simulationResults = {
    network: hre.network.name,
    contractAddress: contractAddress,
    timestamp: new Date().toISOString(),
    configuration: SIMULATION_CONFIG,
    productsCreated: createdProductIds.map(id => id.toString()),
    ordersPlaced: ordersPlaced.map(o => ({
      orderId: o.orderId.toString(),
      productId: o.productId.toString(),
      buyer: o.buyer,
    })),
  };

  fs.writeFileSync(resultsFile, JSON.stringify(simulationResults, null, 2));
  console.log("💾 Simulation results saved to:", resultsFile);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Simulation failed:");
    console.error(error);
    process.exit(1);
  });
