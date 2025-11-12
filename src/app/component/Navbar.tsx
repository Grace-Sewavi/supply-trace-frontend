'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-700 text-white shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          SupplyTrace
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/manufacturer" className="hover:text-indigo-200 transition">
            Manufacturer
          </Link>
          <Link href="/verify" className="hover:text-indigo-200 transition">
            Verify
          </Link>
          <Link href="/admin" className="hover:text-indigo-200 transition">
            Admin
          </Link>

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}