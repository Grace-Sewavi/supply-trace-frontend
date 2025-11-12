// app/verify/page.tsx
'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { format } from 'date-fns';

export default function VerifyProduct() {
  const [code, setCode] = useState('');

  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'verifyProduct',
    args: [code],
    query: { enabled: code.length > 0 },
  });

  const [valid, name, quality, ipfs, manufacturer, timestamp] = data || [];

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
          Verify Product
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Enter product code to verify authenticity on-chain
        </p>
      </div>

      {/* Input Card */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="COCOA001"
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center">
          <p className="text-gray-400 animate-pulse text-lg">Verifying on blockchain...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-900/20 p-8 rounded-2xl border border-red-700 text-center shadow-2xl">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-2xl font-bold text-red-400">Verification Failed</p>
          <p className="text-gray-300 mt-2">Please check the code and try again</p>
        </div>
      )}

      {/* Invalid */}
      {valid === false && code && !isLoading && (
        <div className="max-w-2xl mx-auto bg-red-900/20 p-8 rounded-2xl border border-red-700 text-center shadow-2xl">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-3xl font-bold text-red-400">Not Authentic</p>
          <p className="text-gray-300 mt-3 text-lg">This product is not registered or has been deactivated</p>
        </div>
      )}

      {/* Valid Product */}
      {valid === true && (
        <div className="max-w-2xl mx-auto bg-green-900/20 p-8 rounded-2xl border border-green-700 shadow-2xl">
          <div className="text-center mb-8">
            <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl md:text-4xl font-bold text-green-400">Authentic Product</h2>
            <p className="text-gray-300 mt-2">Verified on Sepolia Blockchain</p>
          </div>

          <div className="space-y-5 text-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Product Code:</span>
              <code className="text-indigo-300 font-mono text-xl">{code}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Quality:</span>
              <span className="text-white">{quality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Verified On:</span>
              <span className="text-white">
                {timestamp ? format(Number(timestamp) * 1000, 'PPP p') : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Manufacturer:</span>
              <code className="text-xs text-indigo-300 break-all max-w-[200px] text-right font-mono">
                {manufacturer}
              </code>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-700 text-center">
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfs}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d inline-flex items-center gap-2 px-8 py-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View IPFS File
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 text-sm">
        <p>Powered by <span className="text-green-400 font-bold">Sepolia Testnet</span> • Gas-free verification</p>
      </footer>
    </div>
  );
}