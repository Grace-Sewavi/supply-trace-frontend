'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { sepolia } from 'wagmi/chains';

// Replace with your actual WalletConnect Project ID
const projectId = '646ff935972b01bb1a5fe2d3fe6837ce'; // Get from https://cloud.walletconnect.com

const config = getDefaultConfig({
  appName: 'SupplyTrace',
  projectId,
  chains: [sepolia],
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}