// app/page.tsx
'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black text-white py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 mb-6">
          SupplyTrace Nigeria
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
          Blockchain traceability for farmers. Register and verify products with one click.
        </p>
      </div>

      {/* Wallet Connect */}
      <div className="flex justify-center mb-12">
        <ConnectButton 
          showBalance={false}
          accountStatus="avatar"
        />
      </div>

      {/* Manufacturer Dashboard Card */}
      <div className="max-w-4xl mx-auto px-4 mb-20">
        <div className="bg-gray-900 p-8 md:p-12 rounded-2xl border border-gray-800 shadow-2xl">
          

          {/* 3D Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Register Product */}
            <Link
              href="/manufacturer"
              className="btn-3d group flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-300"
            >
              <div className="w-16 h-16 mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xl font-bold">Register Product</span>
              <span className="text-sm text-gray-300 mt-1">Add new batch to blockchain</span>
            </Link>

            {/* Verify Product */}
            <Link
              href="/verify"
              className="btn-3d-secondary group flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-300"
            >
              <div className="w-16 h-16 mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Verify Product</span>
              <span className="text-sm text-gray-300 mt-1">Scan QR or enter code</span>
            </Link>
          </div>

          {/* Cost Info */}
          <div className="mt-10 text-center text-gray-400 text-sm">
            <p>Gas cost: <span className="text-green-400 font-bold">~₦300 per registration</span></p>
            <p className="mt-1">On <span className="text-indigo-400 font-bold">Sepolia Testnet</span></p>
          </div>
        </div>
      </div>

      {/* Features Grid with ICONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        {/* For Farmers */}
        <div className="card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-indigo-400 mb-2">For Farmers</h3>
          <p className="text-gray-400">Register your  batch in 30 seconds using your phone</p>
        </div>

        {/* For Buyers */}
        <div className="card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.16l.636 1.956C4.263 18.03 3 15.805 3 13.328V9.5a3.5 3.5 0 017 0v3.828c0 2.477 1.263 4.702 3.44 6.16l.636-1.956C16.737 15.03 18 12.805 18 10.328V9.5a3.5 3.5 0 10-7 0v.5" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-400 mb-2">For Buyers</h3>
          <p className="text-gray-400">Scan QR code to verify authenticity instantly</p>
        </div>

        {/* On Blockchain */}
        <div className="card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-purple-400 mb-2">On Blockchain</h3>
          <p className="text-gray-400">Powered by Sepolia — secure, transparent, and free</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 text-sm">
        <p>© 2025 SupplyTrace Nigeria. Built for farmers.</p>
      </footer>
    </div>
  );
}