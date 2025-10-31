// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract AnonymousSportsGroupBuying is SepoliaConfig {

    address public owner;
    uint256 public nextProductId;
    uint256 public nextOrderId;

    enum ProductCategory {
        FOOTWEAR,
        CLOTHING,
        EQUIPMENT,
        ACCESSORIES,
        FITNESS
    }

    enum OrderStatus {
        PENDING,
        COLLECTING,
        PROCESSING,
        COMPLETED,
        CANCELLED
    }

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 unitPrice;
        uint256 minOrderQuantity;
        uint256 maxOrderQuantity;
        ProductCategory category;
        uint256 deadline;
        bool active;
        address merchant;
        uint256 currentOrders;
        uint256 totalCollected;
    }

    struct GroupOrder {
        uint256 id;
        uint256 productId;
        euint32 encryptedQuantity;
        euint64 encryptedTotalAmount;
        address buyer;
        uint256 timestamp;
        OrderStatus status;
        bool isRevealed;
        uint32 revealedQuantity;
        uint64 revealedAmount;
    }

    struct AnonymousStats {
        uint256 totalParticipants;
        euint64 totalCollectedAmount;
        euint32 totalQuantity;
        bool targetReached;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => GroupOrder) public orders;
    mapping(uint256 => AnonymousStats) public productStats;
    mapping(uint256 => mapping(address => bool)) public hasOrdered;
    mapping(uint256 => uint256[]) public productOrders;

    event ProductCreated(uint256 indexed productId, string name, ProductCategory category);
    event OrderPlaced(uint256 indexed orderId, uint256 indexed productId, address indexed buyer);
    event OrderRevealed(uint256 indexed orderId, uint32 quantity, uint64 amount);
    event GroupOrderCompleted(uint256 indexed productId, uint256 totalOrders, uint256 totalAmount);
    event OrderCancelled(uint256 indexed orderId);
    event ProductDeactivated(uint256 indexed productId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyMerchant(uint256 productId) {
        require(msg.sender == products[productId].merchant, "Not merchant");
        _;
    }

    modifier validProduct(uint256 productId) {
        require(products[productId].id != 0, "Product not exists");
        require(products[productId].active, "Product inactive");
        require(block.timestamp < products[productId].deadline, "Product expired");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextProductId = 1;
        nextOrderId = 1;
    }

    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _unitPrice,
        uint256 _minOrderQuantity,
        uint256 _maxOrderQuantity,
        ProductCategory _category,
        uint256 _deadline
    ) external returns (uint256) {
        require(_unitPrice > 0, "Invalid price");
        require(_minOrderQuantity > 0, "Invalid min quantity");
        require(_maxOrderQuantity >= _minOrderQuantity, "Invalid max quantity");
        require(_deadline > block.timestamp, "Invalid deadline");

        uint256 productId = nextProductId++;

        products[productId] = Product({
            id: productId,
            name: _name,
            description: _description,
            unitPrice: _unitPrice,
            minOrderQuantity: _minOrderQuantity,
            maxOrderQuantity: _maxOrderQuantity,
            category: _category,
            deadline: _deadline,
            active: true,
            merchant: msg.sender,
            currentOrders: 0,
            totalCollected: 0
        });

        productStats[productId] = AnonymousStats({
            totalParticipants: 0,
            totalCollectedAmount: FHE.asEuint64(0),
            totalQuantity: FHE.asEuint32(0),
            targetReached: false
        });

        emit ProductCreated(productId, _name, _category);
        return productId;
    }

    function placeOrder(uint256 productId, uint32 quantity)
        external
        payable
        validProduct(productId)
    {
        require(quantity > 0, "Invalid quantity");
        require(!hasOrdered[productId][msg.sender], "Already ordered");

        Product storage product = products[productId];
        uint256 totalAmount = product.unitPrice * quantity;
        require(msg.value == totalAmount, "Incorrect payment");

        euint32 encryptedQuantity = FHE.asEuint32(quantity);
        euint64 encryptedAmount = FHE.asEuint64(uint64(totalAmount));

        uint256 orderId = nextOrderId++;

        orders[orderId] = GroupOrder({
            id: orderId,
            productId: productId,
            encryptedQuantity: encryptedQuantity,
            encryptedTotalAmount: encryptedAmount,
            buyer: msg.sender,
            timestamp: block.timestamp,
            status: OrderStatus.PENDING,
            isRevealed: false,
            revealedQuantity: 0,
            revealedAmount: 0
        });

        FHE.allowThis(encryptedQuantity);
        FHE.allowThis(encryptedAmount);
        FHE.allow(encryptedQuantity, msg.sender);
        FHE.allow(encryptedAmount, msg.sender);

        hasOrdered[productId][msg.sender] = true;
        productOrders[productId].push(orderId);
        product.currentOrders++;
        product.totalCollected += totalAmount;

        AnonymousStats storage stats = productStats[productId];
        stats.totalParticipants++;
        stats.totalCollectedAmount = FHE.add(stats.totalCollectedAmount, encryptedAmount);
        stats.totalQuantity = FHE.add(stats.totalQuantity, encryptedQuantity);

        emit OrderPlaced(orderId, productId, msg.sender);
    }

    function checkGroupTarget(uint256 productId) public view returns (bool) {
        Product storage product = products[productId];
        return product.currentOrders >= product.minOrderQuantity;
    }

    function processGroupOrder(uint256 productId) external onlyMerchant(productId) {
        require(checkGroupTarget(productId), "Target not reached");

        Product storage product = products[productId];
        require(product.active, "Product inactive");

        uint256[] storage orderIds = productOrders[productId];

        for (uint i = 0; i < orderIds.length; i++) {
            GroupOrder storage order = orders[orderIds[i]];
            if (order.status == OrderStatus.PENDING) {
                order.status = OrderStatus.PROCESSING;
            }
        }

        productStats[productId].targetReached = true;
        emit GroupOrderCompleted(productId, product.currentOrders, product.totalCollected);
    }

    mapping(uint256 => uint256) private pendingOrderReveals;
    uint256 private nextRequestId;

    function revealOrder(uint256 orderId) external {
        GroupOrder storage order = orders[orderId];
        require(order.buyer == msg.sender, "Not your order");
        require(!order.isRevealed, "Already revealed");
        require(order.status == OrderStatus.PROCESSING, "Order not processing");

        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(order.encryptedQuantity);

        // 存储requestId到orderId的映射
        uint256 requestId = nextRequestId++;
        pendingOrderReveals[requestId] = orderId;

        FHE.requestDecryption(cts, this.processOrderReveal.selector);
    }

    function processOrderReveal(
        uint256 requestId,
        uint32 quantity,
        bytes[] memory signatures
    ) external {
        // TODO: 根据实际FHEVM版本调整checkSignatures参数
        // FHE.checkSignatures(requestId, signatures);

        uint256 orderId = pendingOrderReveals[requestId];
        require(orderId != 0, "Invalid request ID");

        GroupOrder storage order = orders[orderId];
        require(order.id != 0, "Order not exists");

        order.isRevealed = true;
        order.revealedQuantity = quantity;
        order.status = OrderStatus.COMPLETED;

        // 清理映射
        delete pendingOrderReveals[requestId];

        emit OrderRevealed(orderId, quantity, 0); // 暂时设置金额为0，可以后续改进
    }

    function cancelOrder(uint256 orderId) external {
        GroupOrder storage order = orders[orderId];
        require(order.buyer == msg.sender, "Not your order");
        require(order.status == OrderStatus.PENDING, "Cannot cancel");

        Product storage product = products[order.productId];
        require(block.timestamp < product.deadline, "Too late to cancel");

        order.status = OrderStatus.CANCELLED;
        hasOrdered[order.productId][msg.sender] = false;
        product.currentOrders--;

        uint256 refundAmount = uint256(order.revealedAmount);
        if (!order.isRevealed) {
            refundAmount = product.unitPrice; // 基础退款
        }

        payable(msg.sender).transfer(refundAmount);
        emit OrderCancelled(orderId);
    }

    function deactivateProduct(uint256 productId) external onlyMerchant(productId) {
        products[productId].active = false;
        emit ProductDeactivated(productId);
    }

    function getProductInfo(uint256 productId) external view returns (
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
    ) {
        Product storage product = products[productId];
        return (
            product.name,
            product.description,
            product.unitPrice,
            product.minOrderQuantity,
            product.maxOrderQuantity,
            product.category,
            product.deadline,
            product.active,
            product.currentOrders,
            product.totalCollected
        );
    }

    function getOrderInfo(uint256 orderId) external view returns (
        uint256 productId,
        address buyer,
        uint256 timestamp,
        OrderStatus status,
        bool isRevealed,
        uint32 revealedQuantity,
        uint64 revealedAmount
    ) {
        GroupOrder storage order = orders[orderId];
        return (
            order.productId,
            order.buyer,
            order.timestamp,
            order.status,
            order.isRevealed,
            order.revealedQuantity,
            order.revealedAmount
        );
    }

    function getAnonymousStats(uint256 productId) external view returns (
        uint256 totalParticipants,
        bool targetReached
    ) {
        AnonymousStats storage stats = productStats[productId];
        return (
            stats.totalParticipants,
            stats.targetReached
        );
    }

    function getProductOrders(uint256 productId) external view returns (uint256[] memory) {
        return productOrders[productId];
    }

    function withdrawFunds(uint256 productId) external onlyMerchant(productId) {
        Product storage product = products[productId];
        require(productStats[productId].targetReached, "Target not reached");

        uint256 amount = product.totalCollected;
        product.totalCollected = 0;

        payable(msg.sender).transfer(amount);
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}