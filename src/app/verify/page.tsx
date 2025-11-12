'use client';

import { useState, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { format } from 'date-fns';

// Define the expected return types for clarity
type ProductData = [
  boolean,
  string,
  string,
  string,
  string,
  bigint // Solidity uint256 is BigInt in JS
];

export default function VerifyProduct() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'notfound' | 'error'>('idle');
  
  // State to hold the final, correctly processed result (with number timestamp)
  const [result, setResult] = useState<any[]>([]);

  const publicClient = usePublicClient();

  const handleVerify = useCallback(async () => {
    if (!code.trim() || !publicClient) return;

    setStatus('loading');
    setResult([]);

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'verifyProduct',
        args: [code],
      });

      // 1. Destructure all 6 return values and use the specific BigInt type
      const [
        valid,
        name,
        quality,
        ipfs,
        manufacturer,
        rawTimestamp // This is the BigInt from the contract
      ] = data as unknown as ProductData;

      if (valid) {
        // 2. Safely convert BigInt (seconds) to a standard JavaScript Number
        // We use Number() here as timestamps are small enough (unlike token amounts)
        const safeTimestamp = Number(rawTimestamp); 
        
        // 3. Store the full, processed array in state
        setResult([valid, name, quality, ipfs, manufacturer, safeTimestamp]);
        setStatus('success');
      } else {
        setStatus('notfound');
      }
    } catch (err: any) {
      console.error('Verify error:', err);
      // In case of any network or contract-level error
      setStatus('error');
    }
  }, [code, publicClient]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleVerify();
  };

  // Destructure the result state (where timestamp is now a number)
  const [valid, name, quality, ipfs, manufacturer, timestamp] = result;

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-3">
          Verify Product
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Enter product code to see full details from manufacturer
        </p>
      </div>

      {/* Input + Button */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="COCOA002"
            className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <button
            onClick={handleVerify}
            disabled={!code.trim() || status === 'loading'}
            className="btn-3d-green px-6 py-3 font-bold text-lg"
          >
            {status === 'loading' ? 'Verifying…' : 'Verify'}
          </button>
        </div>
      </div>

      {/* LOADING */}
      {status === 'loading' && (
        <p className="text-center text-gray-400 animate-pulse text-lg">
          Checking blockchain…
        </p>
      )}

      {/* ERROR */}
      {status === 'error' && (
        <div className="max-w-xl mx-auto bg-red-900/30 p-6 rounded-2xl border border-red-700 text-center">
          <p className="text-red-400 font-bold">Connection Error</p>
          <p className="text-xs text-gray-300 mt-1">
            Check your network or contract deployment.
          </p>
        </div>
      )}

      {/* NOT FOUND */}
      {status === 'notfound' && (
        <div className="max-w-xl mx-auto bg-red-900/30 p-8 rounded-2xl border border-red-700 text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-2xl font-bold text-red-400">Not Found</p>
          <p className="text-gray-300 mt-2">Product not registered or inactive</p>
        </div>
      )}

      {/* SUCCESS */}
      {status === 'success' && valid && (
        <div className="max-w-xl mx-auto bg-green-900/40 p-8 rounded-2xl border border-green-600 shadow-2xl animate-pulse-once">
          <div className="text-center mb-6">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
              Authentic Product
            </h2>
            <p className="text-gray-300 text-sm">
              Verified on Sepolia Blockchain
            </p>
          </div>

          <div className="space-y-4 text-base">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Product Code:</span>
              <code className="text-indigo-300 font-mono text-lg">{code}</code>
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
              <span className="text-gray-400">Registered On:</span>
              <span className="text-white">
                {/* FIX: Use the 'timestamp' number and multiply by 1000 for milliseconds */}
                {timestamp ? format(timestamp * 1000, 'PPP p') : '-'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Manufacturer:</span>
              <code className="text-xs text-indigo-300 break-all max-w-[160px] text-right font-mono">
                {manufacturer}
              </code>
            </div>
          </div>

          {/* IPFS File */}
          <div className="mt-8 p-5 bg-gray-800 rounded-xl border border-gray-700 text-center">
            <p className="text-sm text-gray-400 mb-3">Uploaded File (IPFS)</p>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfs}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-green text-sm px-6 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open File
            </a>
            <p className="text-xs text-gray-500 mt-2 break-all">CID: {ipfs}</p>
          </div>

          {/* Etherscan Button */}
          <div className="mt-6 text-center">
            <a
              href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
            >
              View Contract on Etherscan
            </a>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-gray-500 text-xs">
        <p>Gas-free verification • Powered by Sepolia Testnet</p>
      </footer>
    </div>
  );
}