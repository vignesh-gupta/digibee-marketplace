import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import TrpcProvider from "@/components/Provider";
import { Toaster } from "sonner";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "relative h-full font-sans antialiased",
          poppins.className
        )}
      >
        <main className="relative flex flex-col min-h-screen">
          <TrpcProvider>
            <Navbar />
            <div className="flex-1 grow">{children}</div>
          </TrpcProvider>
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
