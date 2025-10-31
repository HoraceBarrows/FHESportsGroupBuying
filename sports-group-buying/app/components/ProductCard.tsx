'use client';

import { useState } from 'react';
import { formatEther, parseEther } from 'ethers';
import { useContract } from '../../hooks/useContract';
import { useFHEVM } from '../../hooks/useFHEVM';
import { Product } from '../../lib/types';
import { toast } from '../../lib/toast';

const categoryNames = ['Footwear', 'Clothing', 'Equipment', 'Accessories', 'Fitness'];

interface ProductCardProps {
  product: Product;
  onOrderPlaced: () => void;
}

export default function ProductCard({ product, onOrderPlaced }: ProductCardProps) {
  const { contract } = useContract();
  const { instance: fhevm } = useFHEVM();
  const [quantity, setQuantity] = useState<number>(0);
  const [placing, setPlacing] = useState(false);

  const deadline = new Date(Number(product.deadline) * 1000);
  const now = new Date();
  const isExpired = deadline < now;

  const placeOrder = async () => {
    if (!contract || !fhevm) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid purchase quantity');
      return;
    }

    if (quantity < Number(product.minOrderQuantity) || quantity > Number(product.maxOrderQuantity)) {
      toast.error(`Quantity must be between ${product.minOrderQuantity} and ${product.maxOrderQuantity}`);
      return;
    }

    setPlacing(true);
    try {
      toast.info('Encrypting order data with FHE...');

      // Encrypt quantity using FHEVM SDK
      const encryptedQuantity = await fhevm.encrypt32(quantity);

      const unitPriceEth = formatEther(product.unitPrice);
      const totalAmount = parseEther((parseFloat(unitPriceEth) * quantity).toString());

      toast.info('Submitting encrypted order to blockchain...');

      // Call contract to place order with encrypted quantity
      const tx = await contract.placeOrder(product.id, encryptedQuantity, {
        value: totalAmount,
        gasLimit: 800000,
      });

      toast.info('Order submitted, waiting for confirmation...');
      await tx.wait();

      toast.success('Order submitted successfully! Your purchase information has been encrypted and stored.');
      setQuantity(0);

      // Update interface data
      setTimeout(() => onOrderPlaced(), 2000);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order: ' + (error.reason || error.message));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-category">{categoryNames[product.category] || 'Unknown'}</div>
      <div className="product-title">{product.name}</div>
      <div className="product-info">
        <div className="price">{formatEther(product.unitPrice)} ETH / unit</div>
        <div>Min quantity: {product.minOrderQuantity.toString()}</div>
        <div>Max quantity: {product.maxOrderQuantity.toString()}</div>
        <div>Current orders: {product.currentOrders.toString()}</div>
        <div>Deadline: {deadline.toLocaleDateString()}</div>
        {product.description && (
          <div style={{ marginTop: '10px', color: '#666' }}>{product.description}</div>
        )}
      </div>
      <div style={{ marginTop: '15px' }}>
        {!isExpired ? (
          <>
            <input
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              placeholder="Quantity"
              min="1"
              max={product.maxOrderQuantity.toString()}
              style={{
                width: '100px',
                marginRight: '10px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              disabled={placing}
            />
            <button className="button" onClick={placeOrder} disabled={placing}>
              {placing ? 'Processing...' : 'Join Group Buy'}
            </button>
          </>
        ) : (
          <button className="button" disabled>
            Expired
          </button>
        )}
        <span
          className={`status-indicator ${
            Number(product.currentOrders) >= Number(product.minOrderQuantity)
              ? 'status-target-reached'
              : 'status-active'
          }`}
        >
          {Number(product.currentOrders) >= Number(product.minOrderQuantity) ? 'Target Reached' : 'Active'}
        </span>
      </div>
    </div>
  );
}
