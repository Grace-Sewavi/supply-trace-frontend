'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function AdminPanel() {
  const { isConnected } = useAccount();
  const [newMan, setNewMan] = useState('');
  
  // State to hold the transaction hash after it's sent
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const {
    writeContract,
    data: hash, // The hash returned immediately after the transaction is sent
    isPending,
    error: txError,
    reset: resetWrite,
  } = useWriteContract();

  // Hook to wait for confirmation, using the stored txHash
  const { isLoading: confirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // 1. Immediately store the hash returned by useWriteContract
  useEffect(() => {
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);
  
  // 2. Clear hash state on failure to allow retry
  useEffect(() => {
    if (txError && txHash) {
        setTxHash(undefined);
    }
  }, [txError, txHash]);


  const addManufacturer = () => {
    if (!newMan.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address (0x...)');
      return;
    }

    resetWrite(); // Clear previous errors 
    setTxHash(undefined); // Clear our custom hash state
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'addManufacturer',
      args: [newMan as `0x${string}`],
      // Using a lower, safer gas limit
      gas: BigInt(200_000), 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Admin Panel
        </h1>
        <p className="text-gray-400 mt-4">Grant manufacturer access on-chain</p>
      </div>

      {/* Wallet Connect */}
      <div className="flex justify-center mb-10">
        <ConnectButton showBalance={false} accountStatus="avatar" />
      </div>

      {/* Admin Card */}
      <div className="max-w-md mx-auto">
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
            Add Manufacturer
          </h2>

          <input
            type="text"
            placeholder="0x1F75C8e2Dc719319789fbEB8E33967058792AC11"
            value={newMan}
            onChange={(e) => setNewMan(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />

          <button
            onClick={addManufacturer}
            // Button is disabled if pending (sending) OR confirming (waiting for block) OR address is empty
            disabled={isPending || confirming || !newMan}
            className="btn-3d w-full mt-6"
          >
            {isPending
              ? 'Sending Transaction...'
              : confirming
              ? 'Confirming on Chain...'
              : 'Grant Manufacturer Role'}
          </button>

          {/* ---- Error ---- */}
          {txError && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-center">
              <p className="text-red-400 font-bold">Transaction Failed</p>
              <p className="text-xs text-gray-300 mt-1 break-all">{txError.message}</p>
              {txHash && (
                 <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition"
                 >
                    View Failed TX
                 </a>
              )}
            </div>
          )}

          {/* ---- SUCCESS ---- */}
          {/* This is triggered instantly when useWaitForTransactionReceipt confirms the block */}
          {isConfirmed && txHash && (
            <div className="mt-6 p-5 bg-green-900/40 border border-green-600 rounded-xl text-center shadow-lg">
              <p className="text-green-400 font-bold text-lg">Success! ✅</p>
              <p className="text-sm text-gray-300 mt-1">
                Manufacturer role granted to:
              </p>
              <code className="block text-xs text-indigo-300 font-mono mt-2 break-all">
                {newMan}
              </code>
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
              >
                View on Etherscan
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          Only admin can access this page. Gas: ~₦200
        </p>
      </div>
    </div>
  );
}