'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'ethers';
import { useContract } from '../../hooks/useContract';
import { Order } from '../../lib/types';
import { toast } from '../../lib/toast';

const statusNames = ['Pending', 'Collecting', 'Processing', 'Completed', 'Cancelled'];

export default function OrdersList() {
  const { address } = useAccount();
  const { contract } = useContract();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMyOrders = async () => {
    if (!contract || !address) return;

    setLoading(true);
    try {
      const orderList: Order[] = [];

      // Try to load orders by checking order IDs 1-100
      for (let i = 1; i <= 100; i++) {
        try {
          const orderInfo = await contract.getOrderInfo(i);
          if (orderInfo.buyer.toLowerCase() === address.toLowerCase()) {
            orderList.push({
              id: i,
              productId: orderInfo.productId,
              buyer: orderInfo.buyer,
              timestamp: orderInfo.timestamp,
              status: orderInfo.status,
              isRevealed: orderInfo.isRevealed,
              revealedQuantity: orderInfo.revealedQuantity,
              revealedAmount: orderInfo.revealedAmount,
            });
          }
        } catch (error) {
          // Order doesn't exist, continue
          continue;
        }
      }

      setOrders(orderList);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!contract) return;

    try {
      toast.info('Cancelling order...');

      const tx = await contract.cancelOrder(orderId, { gasLimit: 200000 });
      await tx.wait();

      toast.success('Order cancelled successfully!');
      await loadMyOrders();
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      toast.error('Failed to cancel order: ' + (error.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    if (contract && address) {
      loadMyOrders();
    }
  }, [contract, address]);

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Please connect your wallet to view orders
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📋 My Orders</h2>
        <button className="button" onClick={loadMyOrders} style={{ padding: '8px 16px', fontSize: '14px' }}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No orders found. Place your first order!
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
          ))}
        </div>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onCancel: (orderId: number) => void;
}

function OrderCard({ order, onCancel }: OrderCardProps) {
  const { contract } = useContract();
  const [productName, setProductName] = useState<string>('Loading...');

  useEffect(() => {
    const loadProduct = async () => {
      if (!contract) return;
      try {
        const productInfo = await contract.getProductInfo(order.productId);
        setProductName(productInfo.name);
      } catch (error) {
        setProductName('Unknown Product');
      }
    };
    loadProduct();
  }, [contract, order.productId]);

  const orderDate = new Date(Number(order.timestamp) * 1000);

  return (
    <div className="product-card" style={{ marginBottom: '15px' }}>
      <div className="product-title">
        Order #{order.id} - {productName}
      </div>
      <div className="product-info">
        <div>Product ID: {order.productId.toString()}</div>
        <div>
          Quantity: {order.isRevealed ? order.revealedQuantity.toString() : 'Encrypted 🔐'}
        </div>
        <div>
          Amount: {order.isRevealed ? formatEther(order.revealedAmount) + ' ETH' : 'Encrypted 🔐'}
        </div>
        <div>Status: {statusNames[order.status] || 'Unknown'}</div>
        <div>
          Order Date: {orderDate.toLocaleDateString()} {orderDate.toLocaleTimeString()}
        </div>
      </div>
      <div style={{ marginTop: '15px' }}>
        {order.status === 0 && (
          <button className="button" onClick={() => onCancel(order.id)}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
