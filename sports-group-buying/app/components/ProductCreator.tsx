'use client';

import { useState, FormEvent } from 'react';
import { useAccount } from 'wagmi';
import { parseEther } from 'ethers';
import { useContract } from '../../hooks/useContract';
import { toast } from '../../lib/toast';

export default function ProductCreator() {
  const { address } = useAccount();
  const { contract } = useContract();
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productCategory: '',
    unitPrice: '',
    minQuantity: '',
    maxQuantity: '',
    deadline: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!contract) {
      toast.error('Please connect your wallet first');
      return;
    }

    const { productName, productCategory, unitPrice, minQuantity, maxQuantity, deadline } = formData;

    if (!productName || !productCategory || !unitPrice || !minQuantity || !maxQuantity || !deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const unitPriceParsed = parseEther(unitPrice);
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

      toast.info('Creating product...');

      const tx = await contract.createProduct(
        productName,
        formData.productDescription || '',
        unitPriceParsed,
        parseInt(minQuantity),
        parseInt(maxQuantity),
        parseInt(productCategory),
        deadlineTimestamp,
        { gasLimit: 500000 }
      );

      toast.info('Product being created, waiting for confirmation...');
      await tx.wait();

      toast.success('Group buying product created successfully!');

      // Reset form
      setFormData({
        productName: '',
        productDescription: '',
        productCategory: '',
        unitPrice: '',
        minQuantity: '',
        maxQuantity: '',
        deadline: '',
      });
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product: ' + (error.reason || error.message));
    } finally {
      setCreating(false);
    }
  };

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Please connect your wallet to create products
      </div>
    );
  }

  return (
    <div>
      <h2>📦 Create Group Buying Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            required
            placeholder="e.g.: Professional Basketball Shoes"
          />
        </div>

        <div className="form-group">
          <label>Product Description</label>
          <textarea
            rows={3}
            value={formData.productDescription}
            onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
            placeholder="Detailed description of product features and specifications"
          />
        </div>

        <div className="form-group">
          <label>Product Category</label>
          <select
            value={formData.productCategory}
            onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            <option value="0">Footwear</option>
            <option value="1">Clothing</option>
            <option value="2">Equipment</option>
            <option value="3">Accessories</option>
            <option value="4">Fitness</option>
          </select>
        </div>

        <div className="form-group">
          <label>Unit Price (ETH)</label>
          <input
            type="number"
            step="0.001"
            value={formData.unitPrice}
            onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
            required
            placeholder="0.01"
          />
        </div>

        <div className="form-group">
          <label>Minimum Order Quantity</label>
          <input
            type="number"
            value={formData.minQuantity}
            onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
            required
            placeholder="10"
          />
        </div>

        <div className="form-group">
          <label>Maximum Order Quantity</label>
          <input
            type="number"
            value={formData.maxQuantity}
            onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
            required
            placeholder="100"
          />
        </div>

        <div className="form-group">
          <label>Group Buying Deadline</label>
          <input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="button" disabled={creating}>
          {creating ? 'Creating...' : 'Create Group Buying Product'}
        </button>
      </form>
    </div>
  );
}
