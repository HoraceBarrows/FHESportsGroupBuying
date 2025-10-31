export const CONTRACT_ADDRESS = '0xe434D59a1Cc2084672D4929dB9E3b8Af83f01431';

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'uint256', name: '_unitPrice', type: 'uint256' },
      { internalType: 'uint256', name: '_minOrderQuantity', type: 'uint256' },
      { internalType: 'uint256', name: '_maxOrderQuantity', type: 'uint256' },
      { internalType: 'uint8', name: '_category', type: 'uint8' },
      { internalType: 'uint256', name: '_deadline', type: 'uint256' },
    ],
    name: 'createProduct',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'productId', type: 'uint256' },
      { internalType: 'uint32', name: 'quantity', type: 'uint32' },
    ],
    name: 'placeOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'productId', type: 'uint256' }],
    name: 'getProductInfo',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'uint256', name: 'unitPrice', type: 'uint256' },
      { internalType: 'uint256', name: 'minOrderQuantity', type: 'uint256' },
      { internalType: 'uint256', name: 'maxOrderQuantity', type: 'uint256' },
      { internalType: 'uint8', name: 'category', type: 'uint8' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'uint256', name: 'currentOrders', type: 'uint256' },
      { internalType: 'uint256', name: 'totalCollected', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'productId', type: 'uint256' }],
    name: 'getAnonymousStats',
    outputs: [
      { internalType: 'uint256', name: 'totalParticipants', type: 'uint256' },
      { internalType: 'bool', name: 'targetReached', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'orderId', type: 'uint256' }],
    name: 'getOrderInfo',
    outputs: [
      { internalType: 'uint256', name: 'productId', type: 'uint256' },
      { internalType: 'address', name: 'buyer', type: 'address' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { internalType: 'uint8', name: 'status', type: 'uint8' },
      { internalType: 'bool', name: 'isRevealed', type: 'bool' },
      { internalType: 'uint32', name: 'revealedQuantity', type: 'uint32' },
      { internalType: 'uint64', name: 'revealedAmount', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'orderId', type: 'uint256' }],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'productId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'uint8', name: 'category', type: 'uint8' },
    ],
    name: 'ProductCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'orderId', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'productId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
    ],
    name: 'OrderPlaced',
    type: 'event',
  },
];
