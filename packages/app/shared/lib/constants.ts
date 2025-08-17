import { base, baseSepolia } from 'viem/chains';

import { isDevelopment } from './environment';

export const MINTUP_FACTORY_CONTRACT_ADDRESS =
  '0x46BdA2742EAcD9f90b75295E86cF5Af0928d7496' as const;

// Use different USDC contract addresses based on environment
export const USDC_CONTRACT_ADDRESS = (() => {
  if (isDevelopment()) {
    // Development USDC contract address
    return '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const;
  } else {
    // Production USDC contract address
    return '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
  }
})();

export const BASE_CHAIN_ID = (() => {
  if (isDevelopment()) {
    return baseSepolia.id;
  } else {
    return base.id;
  }
})();
