'use client';

import { useState } from 'react';
import Header from './components/Header';
import ProductBrowser from './components/ProductBrowser';
import ProductCreator from './components/ProductCreator';
import OrdersList from './components/OrdersList';
import PrivacyNotice from './components/PrivacyNotice';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'orders'>('browse');

  return (
    <div className="container">
      <Header />

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Products
        </button>
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Product
        </button>
        <button
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
      </div>

      <div className={`tab-content ${activeTab === 'browse' ? 'active' : ''}`}>
        <ProductBrowser />
      </div>

      <div className={`tab-content ${activeTab === 'create' ? 'active' : ''}`}>
        <ProductCreator />
      </div>

      <div className={`tab-content ${activeTab === 'orders' ? 'active' : ''}`}>
        <OrdersList />
      </div>

      <PrivacyNotice />
    </div>
  );
}
