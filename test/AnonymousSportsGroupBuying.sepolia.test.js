const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AnonymousSportsGroupBuying - Sepolia Integration Tests", function () {
  let contract;
  let contractAddress;
  let deployer;
  let step = 0;
  let steps = 0;

  function progress(message) {
    console.log(`    ${++step}/${steps} ${message}`);
  }

  before(async function () {
    // Only run on Sepolia network
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== 11155111n) {
      console.warn("    ⚠️  These tests can only run on Sepolia Testnet");
      console.warn("    Run with: npm run test:sepolia");
      this.skip();
    }

    // Get contract address from environment or deployment
    contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress || contractAddress === "") {
      console.warn("    ⚠️  CONTRACT_ADDRESS not set in .env");
      console.warn("    Deploy first with: npm run deploy");
      this.skip();
    }

    [deployer] = await ethers.getSigners();

    console.log(`    📡 Connecting to contract at ${contractAddress}`);
    contract = await ethers.getContractAt("AnonymousSportsGroupBuying", contractAddress);
  });

  beforeEach(function () {
    step = 0;
    steps = 0;
  });

  describe("Contract Verification", function () {
    it("should be deployed on Sepolia", async function () {
      steps = 2;
      this.timeout(60000);

      progress("Checking contract deployment...");
      const code = await ethers.provider.getCode(contractAddress);
      expect(code).to.not.equal("0x");

      progress("Verifying contract is accessible...");
      const owner = await contract.owner();
      expect(owner).to.be.properAddress;

      console.log(`    ✓ Contract owner: ${owner}`);
    });

    it("should have correct initialization state", async function () {
      steps = 3;
      this.timeout(60000);

      progress("Checking nextProductId...");
      const nextProductId = await contract.nextProductId();
      expect(nextProductId).to.be.gte(1);

      progress("Checking nextOrderId...");
      const nextOrderId = await contract.nextOrderId();
      expect(nextOrderId).to.be.gte(1);

      progress("Checking owner address...");
      const owner = await contract.owner();
      expect(owner).to.be.properAddress;

      console.log(`    ✓ Next Product ID: ${nextProductId}`);
      console.log(`    ✓ Next Order ID: ${nextOrderId}`);
    });
  });

  describe("Read Operations on Sepolia", function () {
    it("should read product information if products exist", async function () {
      steps = 3;
      this.timeout(60000);

      progress("Getting next product ID...");
      const nextProductId = await contract.nextProductId();

      if (nextProductId <= 1) {
        console.log("    ⏭️  No products created yet, skipping...");
        this.skip();
      }

      progress(`Fetching product 1 information...`);
      const productInfo = await contract.getProductInfo(1);

      expect(productInfo.name).to.be.a("string");
      expect(productInfo.unitPrice).to.be.gte(0);
      expect(productInfo.minOrderQuantity).to.be.gt(0);

      progress("Product information retrieved successfully");
      console.log(`    ✓ Product: ${productInfo.name}`);
      console.log(`    ✓ Price: ${ethers.formatEther(productInfo.unitPrice)} ETH`);
      console.log(`    ✓ Min Quantity: ${productInfo.minOrderQuantity}`);
      console.log(`    ✓ Current Orders: ${productInfo.currentOrders}`);
    });

    it("should read anonymous statistics", async function () {
      steps = 2;
      this.timeout(60000);

      progress("Getting next product ID...");
      const nextProductId = await contract.nextProductId();

      if (nextProductId <= 1) {
        console.log("    ⏭️  No products created yet, skipping...");
        this.skip();
      }

      progress("Fetching anonymous statistics for product 1...");
      const stats = await contract.getAnonymousStats(1);

      expect(stats.totalParticipants).to.be.gte(0);
      expect(stats.targetReached).to.be.a("boolean");

      console.log(`    ✓ Total Participants: ${stats.totalParticipants}`);
      console.log(`    ✓ Target Reached: ${stats.targetReached}`);
    });
  });

  describe("Write Operations on Sepolia (if sufficient funds)", function () {
    it("should create a test product on Sepolia", async function () {
      steps = 5;
      this.timeout(4 * 40000); // 160 seconds

      // Check balance first
      const balance = await ethers.provider.getBalance(deployer.address);
      const minBalance = ethers.parseEther("0.01");

      if (balance < minBalance) {
        console.log(`    ⏭️  Insufficient balance (${ethers.formatEther(balance)} ETH), skipping...`);
        this.skip();
      }

      progress("Preparing product parameters...");
      const productName = `Test Product ${Date.now()}`;
      const productDescription = "Sepolia integration test product";
      const unitPrice = ethers.parseEther("0.001");
      const minQuantity = 2;
      const maxQuantity = 50;
      const category = 0;
      const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

      progress("Creating product on Sepolia...");
      const tx = await contract.createProduct(
        productName,
        productDescription,
        unitPrice,
        minQuantity,
        maxQuantity,
        category,
        deadline
      );

      progress("Waiting for transaction confirmation...");
      const receipt = await tx.wait();

      expect(receipt.status).to.equal(1);

      progress("Getting product ID from event...");
      const productCreatedEvent = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          return parsed.name === "ProductCreated";
        } catch {
          return false;
        }
      });

      if (productCreatedEvent) {
        const parsed = contract.interface.parseLog({
          topics: productCreatedEvent.topics,
          data: productCreatedEvent.data
        });
        const productId = parsed.args[0];

        progress(`Product created with ID: ${productId}`);
        console.log(`    ✓ Transaction: ${receipt.hash}`);
        console.log(`    ✓ Gas used: ${receipt.gasUsed.toString()}`);
        console.log(`    ✓ Product ID: ${productId}`);
      }
    });

    it("should place an order on Sepolia if products exist", async function () {
      steps = 6;
      this.timeout(4 * 40000);

      // Check balance
      const balance = await ethers.provider.getBalance(deployer.address);
      const minBalance = ethers.parseEther("0.02");

      if (balance < minBalance) {
        console.log(`    ⏭️  Insufficient balance (${ethers.formatEther(balance)} ETH), skipping...`);
        this.skip();
      }

      progress("Checking for available products...");
      const nextProductId = await contract.nextProductId();

      if (nextProductId <= 1) {
        console.log("    ⏭️  No products available, skipping...");
        this.skip();
      }

      progress("Getting product information...");
      const productInfo = await contract.getProductInfo(1);

      if (!productInfo.active) {
        console.log("    ⏭️  Product not active, skipping...");
        this.skip();
      }

      // Check if already ordered
      progress("Checking order status...");
      const hasOrdered = await contract.hasOrdered(1, deployer.address);

      if (hasOrdered) {
        console.log("    ⏭️  Already ordered this product, skipping...");
        this.skip();
      }

      progress("Placing order...");
      const quantity = Number(productInfo.minOrderQuantity);
      const totalAmount = productInfo.unitPrice * BigInt(quantity);

      const tx = await contract.placeOrder(1, quantity, { value: totalAmount });

      progress("Waiting for transaction confirmation...");
      const receipt = await tx.wait();

      expect(receipt.status).to.equal(1);

      progress("Order placed successfully");
      console.log(`    ✓ Transaction: ${receipt.hash}`);
      console.log(`    ✓ Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`    ✓ Quantity: ${quantity}`);
      console.log(`    ✓ Total paid: ${ethers.formatEther(totalAmount)} ETH`);
    });
  });

  describe("Network Status", function () {
    it("should have correct network configuration", async function () {
      steps = 4;
      this.timeout(60000);

      progress("Checking network...");
      const network = await ethers.provider.getNetwork();
      expect(network.chainId).to.equal(11155111n);

      progress("Checking block number...");
      const blockNumber = await ethers.provider.getBlockNumber();
      expect(blockNumber).to.be.gt(0);

      progress("Checking gas price...");
      const feeData = await ethers.provider.getFeeData();
      expect(feeData.gasPrice).to.be.gt(0);

      progress("Checking deployer balance...");
      const balance = await ethers.provider.getBalance(deployer.address);

      console.log(`    ✓ Chain ID: ${network.chainId}`);
      console.log(`    ✓ Block Number: ${blockNumber}`);
      console.log(`    ✓ Gas Price: ${ethers.formatUnits(feeData.gasPrice, "gwei")} gwei`);
      console.log(`    ✓ Deployer Balance: ${ethers.formatEther(balance)} ETH`);
    });
  });
});
