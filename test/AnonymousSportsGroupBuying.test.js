const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("AnonymousSportsGroupBuying", function () {
  // Test accounts
  let owner, merchant1, merchant2, buyer1, buyer2, buyer3;
  let contract;
  let contractAddress;

  // Deployment fixture
  async function deployContractFixture() {
    const [deployer, m1, m2, b1, b2, b3] = await ethers.getSigners();

    const AnonymousSportsGroupBuying = await ethers.getContractFactory("AnonymousSportsGroupBuying");
    const deployedContract = await AnonymousSportsGroupBuying.deploy();
    await deployedContract.waitForDeployment();

    const address = await deployedContract.getAddress();

    return {
      contract: deployedContract,
      contractAddress: address,
      owner: deployer,
      merchant1: m1,
      merchant2: m2,
      buyer1: b1,
      buyer2: b2,
      buyer3: b3
    };
  }

  beforeEach(async function () {
    const fixture = await loadFixture(deployContractFixture);
    contract = fixture.contract;
    contractAddress = fixture.contractAddress;
    owner = fixture.owner;
    merchant1 = fixture.merchant1;
    merchant2 = fixture.merchant2;
    buyer1 = fixture.buyer1;
    buyer2 = fixture.buyer2;
    buyer3 = fixture.buyer3;
  });

  describe("Deployment and Initialization", function () {
    it("should deploy successfully with correct address", async function () {
      expect(contractAddress).to.be.properAddress;
    });

    it("should set the deployer as owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should initialize nextProductId to 1", async function () {
      expect(await contract.nextProductId()).to.equal(1);
    });

    it("should initialize nextOrderId to 1", async function () {
      expect(await contract.nextOrderId()).to.equal(1);
    });

    it("should have zero initial balance", async function () {
      const balance = await ethers.provider.getBalance(contractAddress);
      expect(balance).to.equal(0);
    });
  });

  describe("Product Creation", function () {
    const productName = "Premium Running Shoes";
    const productDescription = "High-performance running shoes";
    const unitPrice = ethers.parseEther("0.01");
    const minQuantity = 5;
    const maxQuantity = 100;
    const category = 0; // FOOTWEAR

    it("should create a product with valid parameters", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60); // 7 days

      await expect(
        contract.connect(merchant1).createProduct(
          productName,
          productDescription,
          unitPrice,
          minQuantity,
          maxQuantity,
          category,
          deadline
        )
      ).to.emit(contract, "ProductCreated").withArgs(1, productName, category);

      expect(await contract.nextProductId()).to.equal(2);
    });

    it("should increment product ID correctly", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await contract.connect(merchant1).createProduct(
        "Product 1", "", unitPrice, minQuantity, maxQuantity, category, deadline
      );
      await contract.connect(merchant2).createProduct(
        "Product 2", "", unitPrice, minQuantity, maxQuantity, category, deadline
      );

      expect(await contract.nextProductId()).to.equal(3);
    });

    it("should reject product with zero price", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await expect(
        contract.connect(merchant1).createProduct(
          productName,
          productDescription,
          0,
          minQuantity,
          maxQuantity,
          category,
          deadline
        )
      ).to.be.revertedWith("Invalid price");
    });

    it("should reject product with zero minimum quantity", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await expect(
        contract.connect(merchant1).createProduct(
          productName,
          productDescription,
          unitPrice,
          0,
          maxQuantity,
          category,
          deadline
        )
      ).to.be.revertedWith("Invalid min quantity");
    });

    it("should reject product when max quantity < min quantity", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await expect(
        contract.connect(merchant1).createProduct(
          productName,
          productDescription,
          unitPrice,
          100,
          50,
          category,
          deadline
        )
      ).to.be.revertedWith("Invalid max quantity");
    });

    it("should reject product with past deadline", async function () {
      const pastDeadline = (await time.latest()) - 1000;

      await expect(
        contract.connect(merchant1).createProduct(
          productName,
          productDescription,
          unitPrice,
          minQuantity,
          maxQuantity,
          category,
          pastDeadline
        )
      ).to.be.revertedWith("Invalid deadline");
    });

    it("should store product information correctly", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await contract.connect(merchant1).createProduct(
        productName,
        productDescription,
        unitPrice,
        minQuantity,
        maxQuantity,
        category,
        deadline
      );

      const productInfo = await contract.getProductInfo(1);
      expect(productInfo.name).to.equal(productName);
      expect(productInfo.description).to.equal(productDescription);
      expect(productInfo.unitPrice).to.equal(unitPrice);
      expect(productInfo.minOrderQuantity).to.equal(minQuantity);
      expect(productInfo.maxOrderQuantity).to.equal(maxQuantity);
      expect(productInfo.category).to.equal(category);
      expect(productInfo.active).to.equal(true);
      expect(productInfo.currentOrders).to.equal(0);
      expect(productInfo.totalCollected).to.equal(0);
    });

    it("should allow multiple products from same merchant", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await contract.connect(merchant1).createProduct(
        "Product 1", "", unitPrice, minQuantity, maxQuantity, 0, deadline
      );
      await contract.connect(merchant1).createProduct(
        "Product 2", "", unitPrice, minQuantity, maxQuantity, 1, deadline
      );

      const product1 = await contract.getProductInfo(1);
      const product2 = await contract.getProductInfo(2);

      expect(product1.name).to.equal("Product 1");
      expect(product2.name).to.equal("Product 2");
    });

    it("should support all product categories", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      for (let cat = 0; cat < 5; cat++) {
        await contract.connect(merchant1).createProduct(
          `Product Cat ${cat}`, "", unitPrice, minQuantity, maxQuantity, cat, deadline
        );

        const product = await contract.getProductInfo(cat + 1);
        expect(product.category).to.equal(cat);
      }
    });
  });

  describe("Order Placement", function () {
    let productId;
    let unitPrice;
    let deadline;

    beforeEach(async function () {
      unitPrice = ethers.parseEther("0.01");
      deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await contract.connect(merchant1).createProduct(
        "Test Product",
        "Test Description",
        unitPrice,
        5,
        100,
        0,
        deadline
      );
      productId = 1;
    });

    it("should place order with correct payment", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await expect(
        contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount })
      ).to.emit(contract, "OrderPlaced").withArgs(1, productId, buyer1.address);
    });

    it("should increment order counter", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount });
      await contract.connect(buyer2).placeOrder(productId, quantity, { value: totalAmount });

      expect(await contract.nextOrderId()).to.equal(3);
    });

    it("should reject order with zero quantity", async function () {
      await expect(
        contract.connect(buyer1).placeOrder(productId, 0, { value: 0 })
      ).to.be.revertedWith("Invalid quantity");
    });

    it("should reject order with incorrect payment", async function () {
      const quantity = 10;
      const wrongAmount = ethers.parseEther("0.05");

      await expect(
        contract.connect(buyer1).placeOrder(productId, quantity, { value: wrongAmount })
      ).to.be.revertedWith("Incorrect payment");
    });

    it("should reject duplicate order from same buyer", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount });

      await expect(
        contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount })
      ).to.be.revertedWith("Already ordered");
    });

    it("should reject order for non-existent product", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await expect(
        contract.connect(buyer1).placeOrder(999, quantity, { value: totalAmount })
      ).to.be.revertedWith("Product not exists");
    });

    it("should reject order for inactive product", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(merchant1).deactivateProduct(productId);

      await expect(
        contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount })
      ).to.be.revertedWith("Product inactive");
    });

    it("should reject order after deadline", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await time.increaseTo(deadline + 1);

      await expect(
        contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount })
      ).to.be.revertedWith("Product expired");
    });

    it("should update product statistics correctly", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount });

      const productInfo = await contract.getProductInfo(productId);
      expect(productInfo.currentOrders).to.equal(1);
      expect(productInfo.totalCollected).to.equal(totalAmount);
    });

    it("should track multiple orders correctly", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount });
      await contract.connect(buyer2).placeOrder(productId, quantity, { value: totalAmount });
      await contract.connect(buyer3).placeOrder(productId, quantity, { value: totalAmount });

      const productInfo = await contract.getProductInfo(productId);
      expect(productInfo.currentOrders).to.equal(3);
      expect(productInfo.totalCollected).to.equal(totalAmount * BigInt(3));
    });

    it("should store order information correctly", async function () {
      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount });

      const orderInfo = await contract.getOrderInfo(1);
      expect(orderInfo.productId).to.equal(productId);
      expect(orderInfo.buyer).to.equal(buyer1.address);
      expect(orderInfo.status).to.equal(0); // PENDING
      expect(orderInfo.isRevealed).to.equal(false);
    });

    it("should accept different quantities from different buyers", async function () {
      await contract.connect(buyer1).placeOrder(productId, 5, { value: unitPrice * BigInt(5) });
      await contract.connect(buyer2).placeOrder(productId, 10, { value: unitPrice * BigInt(10) });
      await contract.connect(buyer3).placeOrder(productId, 15, { value: unitPrice * BigInt(15) });

      const productInfo = await contract.getProductInfo(productId);
      expect(productInfo.currentOrders).to.equal(3);
    });
  });

  describe("Group Target Checking", function () {
    let productId;
    let unitPrice;

    beforeEach(async function () {
      unitPrice = ethers.parseEther("0.01");
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      await contract.connect(merchant1).createProduct(
        "Test Product",
        "",
        unitPrice,
        5,
        100,
        0,
        deadline
      );
      productId = 1;
    });

    it("should return false when target not reached", async function () {
      const quantity = 5;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(buyer1).placeOrder(productId, quantity, { value: totalAmount });

      expect(await contract.checkGroupTarget(productId)).to.equal(false);
    });

    it("should return true when target reached", async function () {
      const quantity = 5;
      const totalAmount = unitPrice * BigInt(quantity);

      for (let i = 0; i < 5; i++) {
        const [, , , , , buyer] = await ethers.getSigners();
        await contract.connect(buyer).placeOrder(productId, quantity, { value: totalAmount });
      }

      expect(await contract.checkGroupTarget(productId)).to.equal(true);
    });

    it("should return true when target exceeded", async function () {
      const signers = await ethers.getSigners();
      const quantity = 5;
      const totalAmount = unitPrice * BigInt(quantity);

      for (let i = 0; i < 10; i++) {
        await contract.connect(signers[i]).placeOrder(productId, quantity, { value: totalAmount });
      }

      expect(await contract.checkGroupTarget(productId)).to.equal(true);
    });
  });

  describe("Product Management", function () {
    let productId;

    beforeEach(async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      await contract.connect(merchant1).createProduct(
        "Test Product",
        "",
        ethers.parseEther("0.01"),
        5,
        100,
        0,
        deadline
      );
      productId = 1;
    });

    it("should allow merchant to deactivate product", async function () {
      await contract.connect(merchant1).deactivateProduct(productId);

      const productInfo = await contract.getProductInfo(productId);
      expect(productInfo.active).to.equal(false);
    });

    it("should emit event when product deactivated", async function () {
      await expect(
        contract.connect(merchant1).deactivateProduct(productId)
      ).to.emit(contract, "ProductDeactivated").withArgs(productId);
    });

    it("should reject deactivation by non-merchant", async function () {
      await expect(
        contract.connect(buyer1).deactivateProduct(productId)
      ).to.be.revertedWith("Not merchant");
    });
  });

  describe("View Functions", function () {
    it("should return correct product information", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      const name = "Test Product";
      const description = "Test Description";
      const unitPrice = ethers.parseEther("0.01");

      await contract.connect(merchant1).createProduct(
        name, description, unitPrice, 5, 100, 0, deadline
      );

      const info = await contract.getProductInfo(1);
      expect(info.name).to.equal(name);
      expect(info.description).to.equal(description);
      expect(info.unitPrice).to.equal(unitPrice);
    });

    it("should return anonymous statistics", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      await contract.connect(merchant1).createProduct(
        "Test", "", ethers.parseEther("0.01"), 5, 100, 0, deadline
      );

      const stats = await contract.getAnonymousStats(1);
      expect(stats.totalParticipants).to.equal(0);
      expect(stats.targetReached).to.equal(false);
    });

    it("should return product orders", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      const unitPrice = ethers.parseEther("0.01");

      await contract.connect(merchant1).createProduct(
        "Test", "", unitPrice, 5, 100, 0, deadline
      );

      await contract.connect(buyer1).placeOrder(1, 10, { value: unitPrice * BigInt(10) });
      await contract.connect(buyer2).placeOrder(1, 10, { value: unitPrice * BigInt(10) });

      const orders = await contract.getProductOrders(1);
      expect(orders.length).to.equal(2);
      expect(orders[0]).to.equal(1);
      expect(orders[1]).to.equal(2);
    });
  });

  describe("Edge Cases and Security", function () {
    it("should handle maximum uint256 deadline", async function () {
      const maxDeadline = ethers.MaxUint256;

      await expect(
        contract.connect(merchant1).createProduct(
          "Test", "", ethers.parseEther("0.01"), 5, 100, 0, maxDeadline
        )
      ).to.not.be.reverted;
    });

    it("should handle very large quantities", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      const unitPrice = ethers.parseEther("0.00001");
      const largeQuantity = 1000000;

      await contract.connect(merchant1).createProduct(
        "Test", "", unitPrice, 5, largeQuantity, 0, deadline
      );

      const quantity = 1000;
      const totalAmount = unitPrice * BigInt(quantity);

      await expect(
        contract.connect(buyer1).placeOrder(1, quantity, { value: totalAmount })
      ).to.not.be.reverted;
    });

    it("should handle very small unit prices", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      const tinyPrice = 1; // 1 wei

      await contract.connect(merchant1).createProduct(
        "Test", "", tinyPrice, 5, 100, 0, deadline
      );

      await contract.connect(buyer1).placeOrder(1, 10, { value: 10 });

      const productInfo = await contract.getProductInfo(1);
      expect(productInfo.totalCollected).to.equal(10);
    });

    it("should prevent reentrancy in order placement", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      const unitPrice = ethers.parseEther("0.01");

      await contract.connect(merchant1).createProduct(
        "Test", "", unitPrice, 5, 100, 0, deadline
      );

      const quantity = 10;
      const totalAmount = unitPrice * BigInt(quantity);

      await contract.connect(buyer1).placeOrder(1, quantity, { value: totalAmount });

      // Try to place again - should fail
      await expect(
        contract.connect(buyer1).placeOrder(1, quantity, { value: totalAmount })
      ).to.be.revertedWith("Already ordered");
    });
  });

  describe("Gas Optimization", function () {
    it("should not exceed gas limit for product creation", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      const tx = await contract.connect(merchant1).createProduct(
        "Test Product",
        "Test Description",
        ethers.parseEther("0.01"),
        5,
        100,
        0,
        deadline
      );

      const receipt = await tx.wait();
      expect(receipt.gasUsed).to.be.lt(500000);
    });

    it("should not exceed gas limit for order placement", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);
      const unitPrice = ethers.parseEther("0.01");

      await contract.connect(merchant1).createProduct(
        "Test", "", unitPrice, 5, 100, 0, deadline
      );

      const tx = await contract.connect(buyer1).placeOrder(1, 10, {
        value: unitPrice * BigInt(10)
      });

      const receipt = await tx.wait();
      expect(receipt.gasUsed).to.be.lt(1000000);
    });

    it("should efficiently handle multiple product queries", async function () {
      const deadline = (await time.latest()) + (7 * 24 * 60 * 60);

      for (let i = 0; i < 5; i++) {
        await contract.connect(merchant1).createProduct(
          `Product ${i}`, "", ethers.parseEther("0.01"), 5, 100, 0, deadline
        );
      }

      const startGas = await ethers.provider.getBalance(buyer1.address);

      for (let i = 1; i <= 5; i++) {
        await contract.getProductInfo(i);
      }

      // View functions should not consume gas
    });
  });
});
