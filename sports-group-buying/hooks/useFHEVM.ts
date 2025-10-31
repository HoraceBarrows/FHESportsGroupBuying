import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { createInstance, FhevmInstance } from '@fhevm/sdk';

const SEPOLIA_CHAIN_ID = 11155111;
const GATEWAY_URL = 'https://gateway.zama.ai';

export function useFHEVM() {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFHEVM = async () => {
      if (!walletClient || !address || chainId !== SEPOLIA_CHAIN_ID) {
        setInstance(null);
        return;
      }

      if (isInitializing || instance) return;

      setIsInitializing(true);
      setError(null);

      try {
        console.log('Initializing FHEVM instance...');

        const fhevmInstance = await createInstance({
          chainId: SEPOLIA_CHAIN_ID,
          gatewayUrl: GATEWAY_URL,
        });

        setInstance(fhevmInstance);
        console.log('FHEVM instance created successfully');
      } catch (err: any) {
        console.error('Failed to initialize FHEVM:', err);
        setError(err.message || 'Failed to initialize FHEVM');
        setInstance(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initFHEVM();
  }, [walletClient, address, chainId]);

  return {
    instance,
    isInitializing,
    error,
    isReady: !!instance && !isInitializing,
  };
}
