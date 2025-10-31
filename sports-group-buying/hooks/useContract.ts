import { useMemo } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Contract, BrowserProvider } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contractABI';

export function useContract() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const contract = useMemo(() => {
    if (!walletClient || !address) return null;

    try {
      const provider = new BrowserProvider(walletClient as any);
      const signer = provider.getSigner();
      return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer as any);
    } catch (error) {
      console.error('Failed to create contract instance:', error);
      return null;
    }
  }, [walletClient, address]);

  return { contract, address: CONTRACT_ADDRESS };
}
