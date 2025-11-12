'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ManufacturerDashboard() {
  const { address, isConnected } = useAccount();
  const {
    writeContract,
    data: hash,
    isPending,
    error: txError,
  } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [form, setForm] = useState({
    productId: '',
    productName: '',
    ipfsHash: '',
    qualityInfo: '',
  });
  const [uploading, setUploading] = useState(false);
  const [forceSuccess, setForceSuccess] = useState(false);

  const uploadToPinata = async (file: File) => {
    setUploading(true);
    try {
      const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
      if (!jwt) throw new Error('Pinata JWT missing');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Upload failed');

      setForm((prev) => ({ ...prev, ipfsHash: data.IpfsHash }));
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToPinata(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ipfsHash) return alert('Upload file first');

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'registerProduct',
      args: [form.productId, form.productName, form.ipfsHash, form.qualityInfo],
      // higher gas limit – safe for Sepolia
      gas: BigInt(500_000),
    });
  };

  // optional “force success” after 15 s (kept for very slow nodes)
  useEffect(() => {
    if (hash && confirming) {
      const timer = setTimeout(() => setForceSuccess(true), 15_000);
      return () => clearTimeout(timer);
    }
  }, [hash, confirming]);

  const showSuccess = isSuccess || forceSuccess;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-400">
          Register New Product Batch
        </h1>
        <ConnectButton />
      </div>

      {!isConnected ? (
        <p className="text-center text-gray-400">Connect wallet to register</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800 space-y-6"
        >
          <input
            placeholder="Product ID (e.g. COCOA002)"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            placeholder="Product Name"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <div>
            <label className="block font-medium mb-2 text-gray-300">
              Upload Metadata
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-indigo-600 file:text-white file:border-0"
            />
            {form.ipfsHash && (
              <p className="mt-2 p-2 bg-green-900/30 border border-green-700 rounded text-sm text-green-400">
                CID: <code className="break-all">{form.ipfsHash}</code>
              </p>
            )}
          </div>

          <input
            placeholder="Quality Info"
            value={form.qualityInfo}
            onChange={(e) => setForm({ ...form, qualityInfo: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={isPending || confirming || uploading || !form.ipfsHash}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold disabled:bg-gray-700 disabled:cursor-not-allowed transition"
          >
            {uploading
              ? 'Uploading...'
              : isPending
              ? 'Sending...'
              : confirming && !showSuccess
              ? 'Confirming...'
              : 'Register (~₦300)'}
          </button>

          {txError && (
            <p className="text-red-400 text-center">{txError.message}</p>
          )}

          {showSuccess && hash && (
            <p className="text-green-400 text-center">
              Success!{' '}
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on Etherscan
              </a>
            </p>
          )}
        </form>
      )}
    </div>
  );
}