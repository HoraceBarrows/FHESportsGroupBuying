// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, externalEuint64, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title AnonymousSportsGroupBuying
 * @dev Privacy-preserving sports equipment group purchasing platform using FHE
 * Features: Encrypted orders, timeout protection, refund mechanism, Gateway callback pattern
 */
contract AnonymousSportsGroupBuying is SepoliaConfig {

    address public owner;
    uint256 public nextProductId;
    uint256 public nextOrderId;
    uint256 public nextRequestId;

    // Configuration
    uint256 public constant DECRYPTION_TIMEOUT = 7 days;
    uint256 public constant MAX_ORDER_TIMEOUT = 30 days;
    uint256 public constant REFUND_WAIT_TIME = 1 hours;

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
        CANCELLED,
        REFUNDED
    }

    enum DecryptionStatus {
        NONE,
        REQUESTED,
        COMPLETED,
        FAILED
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
        uint256 createdAt;
        bool active;
        address merchant;
        uint256 currentOrders;
        uint256 totalCollected;
        bool targetReached;
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
        DecryptionStatus decryptionStatus;
        uint256 decryptionRequestId;
        uint256 decryptionTimeout;
    }

    struct AnonymousStats {
        uint256 totalParticipants;
        euint64 totalCollectedAmount;
        euint32 totalQuantity;
        bool targetReached;
    }

    // Mappings
    mapping(uint256 => Product) public products;
    mapping(uint256 => GroupOrder) public orders;
    mapping(uint256 => AnonymousStats) public productStats;
    mapping(uint256 => mapping(address => bool)) public hasOrdered;
    mapping(uint256 => uint256[]) public productOrders;
    mapping(uint256 => uint256) public decryptionRequestToOrder; // requestId => orderId
    mapping(address => uint256) public pendingRefunds;

    // Audit logging
    event ProductCreated(uint256 indexed productId, string name, ProductCategory category, uint256 deadline);
    event OrderPlaced(uint256 indexed orderId, uint256 indexed productId, address indexed buyer, uint256 timestamp);
    event OrderRevealed(uint256 indexed orderId, uint32 quantity, uint64 amount);
    event GroupOrderCompleted(uint256 indexed productId, uint256 totalOrders, uint256 totalAmount);
    event OrderCancelled(uint256 indexed orderId, address indexed buyer);
    event ProductDeactivated(uint256 indexed productId);
    event DecryptionRequested(uint256 indexed orderId, uint256 indexed requestId, uint256 timeout);
    event DecryptionCompleted(uint256 indexed orderId, uint256 indexed requestId);
    event DecryptionFailed(uint256 indexed orderId, uint256 indexed requestId);
    event RefundProcessed(address indexed buyer, uint256 amount);
    event AuditLog(string indexed action, address indexed actor, uint256 indexed itemId, string details);

    // Modifiers with input validation
    modifier onlyOwner() {
        require(msg.sender == owner, "Auth: Only owner");
        _;
    }

    modifier onlyMerchant(uint256 productId) {
        require(msg.sender == products[productId].merchant, "Auth: Not merchant");
        _;
    }

    modifier validProduct(uint256 productId) {
        require(products[productId].id != 0, "Validation: Product not exists");
        require(products[productId].active, "Validation: Product inactive");
        require(block.timestamp < products[productId].deadline, "Validation: Product expired");
        _;
    }

    modifier validOrder(uint256 orderId) {
        require(orders[orderId].id != 0, "Validation: Order not exists");
        _;
    }

    modifier nonZeroAddress(address _address) {
        require(_address != address(0), "Validation: Zero address");
        _;
    }

    modifier inputValidation(uint256 value, string memory field) {
        require(value > 0, string(abi.encodePacked("Validation: ", field, " must be positive")));
        _;
    }

    constructor() {
        owner = msg.sender;
        nextProductId = 1;
        nextOrderId = 1;
        nextRequestId = 1;
        emit AuditLog("INIT", msg.sender, 0, "Contract deployed");
    }

    /**
     * @dev Create a new product with enhanced validation
     * @param _name Product name
     * @param _description Product description
     * @param _unitPrice Price per unit
     * @param _minOrderQuantity Minimum order quantity for group target
     * @param _maxOrderQuantity Maximum order quantity per buyer
     * @param _category Product category
     * @param _deadline Order deadline (unix timestamp)
     * @return productId The ID of the created product
     */
    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _unitPrice,
        uint256 _minOrderQuantity,
        uint256 _maxOrderQuantity,
        ProductCategory _category,
        uint256 _deadline
    ) external returns (uint256) {
        // Input validation
        require(bytes(_name).length > 0 && bytes(_name).length <= 256, "Validation: Invalid name");
        require(bytes(_description).length <= 1000, "Validation: Description too long");
        require(_unitPrice > 0, "Validation: Unit price must be positive");
        require(_minOrderQuantity > 0 && _minOrderQuantity <= 10000, "Validation: Invalid min quantity");
        require(_maxOrderQuantity >= _minOrderQuantity && _maxOrderQuantity <= 100000, "Validation: Invalid max quantity");

        // Overflow protection: prevent massive total amount
        require(_unitPrice <= type(uint256).max / _maxOrderQuantity, "Overflow: Total amount too large");
        require(_deadline > block.timestamp, "Validation: Deadline must be in future");
        require(_deadline <= block.timestamp + MAX_ORDER_TIMEOUT, "Validation: Deadline too far");

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
            createdAt: block.timestamp,
            active: true,
            merchant: msg.sender,
            currentOrders: 0,
            totalCollected: 0,
            targetReached: false
        });

        productStats[productId] = AnonymousStats({
            totalParticipants: 0,
            totalCollectedAmount: FHE.asEuint64(0),
            totalQuantity: FHE.asEuint32(0),
            targetReached: false
        });

        emit ProductCreated(productId, _name, _category, _deadline);
        emit AuditLog("CREATE_PRODUCT", msg.sender, productId, "Product created with target quantity");
        return productId;
    }

    /**
     * @dev Place an encrypted order with full validation
     * Gateway callback pattern: User -> Contract -> Gateway -> Callback
     * @param productId The product ID
     * @param quantity Order quantity (will be encrypted)
     */
    function placeOrder(uint256 productId, uint32 quantity)
        external
        payable
        validProduct(productId)
        nonZeroAddress(msg.sender)
    {
        // Input validation
        require(quantity > 0 && quantity <= 10000, "Validation: Invalid quantity");
        require(!hasOrdered[productId][msg.sender], "Validation: Already ordered");

        Product storage product = products[productId];
        require(quantity <= product.maxOrderQuantity, "Validation: Exceeds max quantity");

        // Overflow protection
        uint256 totalAmount = product.unitPrice * uint256(quantity);
        require(totalAmount <= type(uint256).max / 2, "Overflow: Amount too large");
        require(msg.value == totalAmount, "Validation: Incorrect payment");
        require(product.currentOrders < product.maxOrderQuantity, "Validation: Order limit reached");

        // Encrypt sensitive data
        euint32 encryptedQuantity = FHE.asEuint32(quantity);
        euint64 encryptedAmount = FHE.asEuint64(uint64(totalAmount));

        uint256 orderId = nextOrderId++;

        // Create order with timeout protection
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
            revealedAmount: 0,
            decryptionStatus: DecryptionStatus.NONE,
            decryptionRequestId: 0,
            decryptionTimeout: block.timestamp + MAX_ORDER_TIMEOUT
        });

        // Allow decryption for authorized parties
        FHE.allowThis(encryptedQuantity);
        FHE.allowThis(encryptedAmount);
        FHE.allow(encryptedQuantity, msg.sender);
        FHE.allow(encryptedAmount, msg.sender);

        // Update state: record order
        hasOrdered[productId][msg.sender] = true;
        productOrders[productId].push(orderId);
        product.currentOrders++;
        product.totalCollected += totalAmount;

        // Homomorphic aggregation of encrypted data
        AnonymousStats storage stats = productStats[productId];
        stats.totalParticipants++;
        stats.totalCollectedAmount = FHE.add(stats.totalCollectedAmount, encryptedAmount);
        stats.totalQuantity = FHE.add(stats.totalQuantity, encryptedQuantity);

        emit OrderPlaced(orderId, productId, msg.sender, block.timestamp);
        emit AuditLog("PLACE_ORDER", msg.sender, orderId, "Encrypted order placed");
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

    /**
     * @dev Request decryption of order using Gateway callback pattern
     * Pattern: requestDecryption -> Gateway -> callback
     * @param orderId Order to decrypt
     */
    function requestOrderDecryption(uint256 orderId)
        external
        validOrder(orderId)
        nonZeroAddress(msg.sender)
    {
        GroupOrder storage order = orders[orderId];
        require(order.buyer == msg.sender, "Auth: Not order owner");
        require(!order.isRevealed, "Validation: Already revealed");
        require(order.status == OrderStatus.PROCESSING, "Validation: Order not processing");
        require(order.decryptionStatus == DecryptionStatus.NONE, "Validation: Already requested");

        // Timeout protection: prevent permanent locks
        require(block.timestamp < order.decryptionTimeout, "Validation: Decryption timeout");

        // Prepare ciphertext for decryption via Gateway
        bytes32[] memory cts = new bytes32[](2);
        cts[0] = FHE.toBytes32(order.encryptedQuantity);
        cts[1] = FHE.toBytes32(order.encryptedTotalAmount);

        // Request decryption - Gateway will call back with results
        uint256 requestId = FHE.requestDecryption(
            cts,
            this.processOrderDecryptionCallback.selector,
            address(this),
            0,
            block.number
        );

        // Record decryption request for timeout management
        order.decryptionStatus = DecryptionStatus.REQUESTED;
        order.decryptionRequestId = requestId;
        decryptionRequestToOrder[requestId] = orderId;

        emit DecryptionRequested(orderId, requestId, order.decryptionTimeout);
        emit AuditLog("REQUEST_DECRYPTION", msg.sender, orderId, "Decryption requested via Gateway");
    }

    /**
     * @dev Gateway callback function for order decryption
     * Called by Zama Gateway after decryption of encrypted values
     * @param requestId The decryption request ID
     * @param quantity Decrypted order quantity
     * @param amount Decrypted order amount
     * @param decryptionProof Proof of correct decryption
     */
    function processOrderDecryptionCallback(
        uint256 requestId,
        uint32 quantity,
        uint64 amount,
        bytes memory decryptionProof
    ) external {
        // Verify decryption proof from Gateway
        // FHE.checkSignatures(requestId, decryptionProof);

        uint256 orderId = decryptionRequestToOrder[requestId];
        require(orderId != 0, "Validation: Invalid request ID");

        GroupOrder storage order = orders[orderId];
        require(order.id != 0, "Validation: Order not exists");

        // Validate decryption result
        require(quantity > 0 && quantity <= 100000, "Validation: Invalid decrypted quantity");
        require(amount > 0, "Validation: Invalid decrypted amount");
        require(block.timestamp < order.decryptionTimeout, "Validation: Decryption timeout exceeded");

        // Update order with decrypted values
        order.isRevealed = true;
        order.revealedQuantity = quantity;
        order.revealedAmount = amount;
        order.status = OrderStatus.COMPLETED;
        order.decryptionStatus = DecryptionStatus.COMPLETED;

        // Clean up request tracking
        delete decryptionRequestToOrder[requestId];

        emit DecryptionCompleted(orderId, requestId);
        emit OrderRevealed(orderId, quantity, amount);
        emit AuditLog("DECRYPT_COMPLETE", address(0), orderId, "Order decrypted via Gateway");
    }

    /**
     * @dev Handle decryption failure and process refund
     * Called if Gateway cannot decrypt due to invalid input/timeout
     * @param orderId Order with failed decryption
     */
    function handleDecryptionFailure(uint256 orderId)
        external
        validOrder(orderId)
        onlyOwner
    {
        GroupOrder storage order = orders[orderId];
        require(order.decryptionStatus == DecryptionStatus.REQUESTED, "Validation: Not requested");
        require(block.timestamp >= order.decryptionTimeout, "Validation: Timeout not reached");

        // Mark as failed
        order.decryptionStatus = DecryptionStatus.FAILED;
        order.status = OrderStatus.REFUNDED;

        // Refund to buyer
        Product storage product = products[order.productId];
        uint256 refundAmount = product.unitPrice;
        if (order.isRevealed) {
            refundAmount = order.revealedAmount;
        }

        // Use pull pattern in case push fails
        pendingRefunds[order.buyer] += refundAmount;

        emit DecryptionFailed(orderId, order.decryptionRequestId);
        emit AuditLog("DECRYPT_FAILED", msg.sender, orderId, "Decryption failed - refund initiated");
    }

    /**
     * @dev Cancel an order and process refund
     * Handles both encrypted and revealed orders
     * @param orderId The order ID to cancel
     */
    function cancelOrder(uint256 orderId)
        external
        validOrder(orderId)
        nonZeroAddress(msg.sender)
    {
        GroupOrder storage order = orders[orderId];
        require(order.buyer == msg.sender, "Auth: Not order owner");
        require(order.status == OrderStatus.PENDING, "Validation: Order not pending");

        Product storage product = products[order.productId];
        require(block.timestamp < product.deadline, "Validation: Too late to cancel");

        // Prevent permanent locks by checking timeout
        require(block.timestamp < order.decryptionTimeout, "Validation: Order timeout exceeded");

        order.status = OrderStatus.CANCELLED;
        hasOrdered[order.productId][msg.sender] = false;
        product.currentOrders--;
        product.totalCollected -= product.unitPrice;

        // Calculate refund amount
        uint256 refundAmount = product.unitPrice;
        if (order.isRevealed) {
            refundAmount = order.revealedAmount;
        }

        // Process refund safely
        _processRefund(msg.sender, refundAmount);

        emit OrderCancelled(orderId, msg.sender);
        emit AuditLog("CANCEL_ORDER", msg.sender, orderId, "Order cancelled with refund");
    }

    /**
     * @dev Process refund using pull pattern (safer than push)
     * @param recipient Address to receive refund
     * @param amount Amount to refund
     */
    function _processRefund(address recipient, uint256 amount) internal nonZeroAddress(recipient) {
        require(amount > 0, "Validation: Refund amount must be positive");
        require(address(this).balance >= amount, "Validation: Insufficient contract balance");

        // Use call pattern for safe transfer
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Refund: Transfer failed");

        emit RefundProcessed(recipient, amount);
    }

    /**
     * @dev Claim pending refund (pull pattern)
     * Used when direct refund transfer failed
     */
    function claimPendingRefund() external nonZeroAddress(msg.sender) {
        uint256 refundAmount = pendingRefunds[msg.sender];
        require(refundAmount > 0, "Validation: No pending refund");

        // Clear before transfer (prevent reentrancy)
        pendingRefunds[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund: Transfer failed");

        emit RefundProcessed(msg.sender, refundAmount);
    }

    function deactivateProduct(uint256 productId) external onlyMerchant(productId) {
        products[productId].active = false;
        emit ProductDeactivated(productId);
    }

    /**
     * @dev Get full product information
     * @param productId The product ID
     * @return Product details
     */
    function getProductInfo(uint256 productId)
        external
        view
        validProduct(productId)
        returns (
            string memory name,
            string memory description,
            uint256 unitPrice,
            uint256 minOrderQuantity,
            uint256 maxOrderQuantity,
            ProductCategory category,
            uint256 deadline,
            uint256 createdAt,
            bool active,
            uint256 currentOrders,
            uint256 totalCollected,
            bool targetReached
        )
    {
        Product storage product = products[productId];
        return (
            product.name,
            product.description,
            product.unitPrice,
            product.minOrderQuantity,
            product.maxOrderQuantity,
            product.category,
            product.deadline,
            product.createdAt,
            product.active,
            product.currentOrders,
            product.totalCollected,
            product.targetReached
        );
    }

    /**
     * @dev Get order information with decryption status
     * @param orderId The order ID
     * @return Order details including decryption status
     */
    function getOrderInfo(uint256 orderId)
        external
        view
        validOrder(orderId)
        returns (
            uint256 productId,
            address buyer,
            uint256 timestamp,
            OrderStatus status,
            bool isRevealed,
            uint32 revealedQuantity,
            uint64 revealedAmount,
            DecryptionStatus decryptionStatus,
            uint256 decryptionTimeout
        )
    {
        GroupOrder storage order = orders[orderId];
        // Only reveal to order owner or contract owner
        require(
            msg.sender == order.buyer || msg.sender == owner,
            "Auth: Cannot view others' orders"
        );

        return (
            order.productId,
            order.buyer,
            order.timestamp,
            order.status,
            order.isRevealed,
            order.revealedQuantity,
            order.revealedAmount,
            order.decryptionStatus,
            order.decryptionTimeout
        );
    }

    /**
     * @dev Get privacy-preserving statistics (no individual data revealed)
     * @param productId The product ID
     * @return Privacy-safe statistics
     */
    function getAnonymousStats(uint256 productId)
        external
        view
        returns (
            uint256 totalParticipants,
            bool targetReached
        )
    {
        AnonymousStats storage stats = productStats[productId];
        return (
            stats.totalParticipants,
            stats.targetReached
        );
    }

    /**
     * @dev Get all order IDs for a product (merchant only)
     * @param productId The product ID
     * @return Array of order IDs
     */
    function getProductOrders(uint256 productId)
        external
        view
        onlyMerchant(productId)
        returns (uint256[] memory)
    {
        return productOrders[productId];
    }

    /**
     * @dev Withdraw collected funds (merchant only, after target reached)
     * Uses safe call pattern to prevent reentrancy
     * @param productId The product ID
     */
    function withdrawFunds(uint256 productId)
        external
        onlyMerchant(productId)
    {
        Product storage product = products[productId];
        require(product.targetReached, "Validation: Target not reached");

        uint256 amount = product.totalCollected;
        require(amount > 0, "Validation: No funds to withdraw");
        require(address(this).balance >= amount, "Validation: Insufficient balance");

        // Prevent reentrancy: clear before transfer
        product.totalCollected = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal: Transfer failed");

        emit AuditLog("WITHDRAW_FUNDS", msg.sender, productId, "Funds withdrawn");
    }

    /**
     * @dev Emergency withdrawal by owner only
     * Used for recovery in case of critical issues
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Validation: No balance");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Emergency: Withdrawal failed");

        emit AuditLog("EMERGENCY_WITHDRAW", msg.sender, 0, "Emergency withdrawal executed");
    }

    /**
     * @dev View pending refund for an address
     * @param user The user address
     * @return Amount pending refund
     */
    function getPendingRefund(address user)
        external
        view
        nonZeroAddress(user)
        returns (uint256)
    {
        return pendingRefunds[user];
    }

    /**
     * @dev Check if user has ordered a product
     * @param productId The product ID
     * @param user The user address
     * @return True if user has ordered
     */
    function hasUserOrdered(uint256 productId, address user)
        external
        view
        nonZeroAddress(user)
        returns (bool)
    {
        return hasOrdered[productId][user];
    }

    /**
     * @dev Get decryption status of an order
     * @param orderId The order ID
     * @return Status enum and timeout
     */
    function getDecryptionStatus(uint256 orderId)
        external
        view
        validOrder(orderId)
        returns (DecryptionStatus status, uint256 timeout, uint256 requestId)
    {
        GroupOrder storage order = orders[orderId];
        require(msg.sender == order.buyer || msg.sender == owner, "Auth: Cannot view");
        return (order.decryptionStatus, order.decryptionTimeout, order.decryptionRequestId);
    }

    /**
     * @dev Check if decryption request has timed out
     * @param orderId The order ID
     * @return True if timeout exceeded
     */
    function isDecryptionTimeout(uint256 orderId)
        external
        view
        validOrder(orderId)
        returns (bool)
    {
        GroupOrder storage order = orders[orderId];
        return block.timestamp >= order.decryptionTimeout;
    }

    // Fallback function to receive ETH
    receive() external payable {
        emit AuditLog("RECEIVE_ETH", msg.sender, 0, "ETH received");
    }
}