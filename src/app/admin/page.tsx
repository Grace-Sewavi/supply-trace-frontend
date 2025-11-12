// app/admin/page.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function AdminPanel() {
  const { address, isConnected } = useAccount();
  const [newMan, setNewMan] = useState('');
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const addManufacturer = () => {
    if (!newMan.startsWith('0x') || newMan.length !== 42) {
      alert('Enter valid 0x address');
      return;
    }
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'addManufacturer',
      args: [newMan as `0x${string}`],
      gas: BigInt(150000),
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

          {/* Input Box – NOW VISIBLE */}
          <input
            type="text"
            placeholder="0x1F75C8e2Dc719319789fbEB8E33967058792AC11"
            value={newMan}
            onChange={(e) => setNewMan(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />

          {/* 3D Button */}
          <button
            onClick={addManufacturer}
            disabled={isPending || confirming || !newMan}
            className="btn-3d w-full mt-6"
          >
            {isPending ? 'Sending...' : confirming ? 'Confirming...' : 'Grant Manufacturer Role'}
          </button>

          {/* Success */}
          {isSuccess && hash && (
            <div className="success-box mt-6 text-center">
              <p className="text-green-400 font-bold">Success!</p>
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline text-sm"
              >
                View on Etherscan
              </a>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-500 text-xs mt-8">
          Only admin can access this page. Gas: ~₦300
        </p>
      </div>
    </div>
  );
}