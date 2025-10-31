'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <div className="header">
      <h1>🏃‍♂️ Anonymous Sports Group Buying Platform</h1>
      <p className="subtitle">
        Based on FHE homomorphic encryption technology, protect your privacy and enjoy group buying discounts
      </p>

      <div className="wallet-section">
        <ConnectButton />
      </div>
    </div>
  );
}
