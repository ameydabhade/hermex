import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/CartContext";
import Navbar from "../components/Navbar";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hermex - Premium Ecommerce Experience",
  description: "Discover amazing products with the best shopping experience. Beauty, groceries, and more delivered with premium quality.",
  keywords: "ecommerce, shopping, beauty, groceries, online store, hermex",
  authors: [{ name: "Hermex Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} antialiased font-lora`}
      >
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
