// app/layout.tsx
import './globals.css';
import Provider from './provider';
import Navbar from './component/Navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SupplyTrace - Cocoa Traceability',
  description: 'Blockchain traceability for Nigerian farmers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`min-h-screen bg-black text-white ${inter.className}`}>
        <Provider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}