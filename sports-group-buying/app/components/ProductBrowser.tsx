'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useContract } from '../../hooks/useContract';
import { useFHEVM } from '../../hooks/useFHEVM';
import ProductCard from './ProductCard';
import { Product } from '../../lib/types';

export default function ProductBrowser() {
  const { address } = useAccount();
  const { contract } = useContract();
  const { instance } = useFHEVM();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const productList: Product[] = [];

      // Try to load products by checking product IDs 1-20
      for (let i = 1; i <= 20; i++) {
        try {
          const productInfo = await contract.getProductInfo(i);
          if (productInfo.name && productInfo.active) {
            productList.push({
              id: i,
              name: productInfo.name,
              description: productInfo.description,
              unitPrice: productInfo.unitPrice,
              minOrderQuantity: productInfo.minOrderQuantity,
              maxOrderQuantity: productInfo.maxOrderQuantity,
              category: productInfo.category,
              deadline: productInfo.deadline,
              active: productInfo.active,
              currentOrders: productInfo.currentOrders,
              totalCollected: productInfo.totalCollected,
            });
          }
        } catch (error) {
          // Product doesn't exist, continue to next
          continue;
        }
      }

      setProducts(productList);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      loadProducts();
    }
  }, [contract]);

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Please connect your wallet to browse products
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🛍️ Browse Sports Products</h2>
        <button className="button" onClick={loadProducts} style={{ padding: '8px 16px', fontSize: '14px' }}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No active products found. Create the first product!
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onOrderPlaced={loadProducts} />
          ))}
        </div>
      )}
    </div>
  );
}
