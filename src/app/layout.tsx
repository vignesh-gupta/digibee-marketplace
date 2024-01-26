import TrpcProvider from "@/components/TrpcProvider";
import Navbar from "@/components/nav/Navbar";
import { cn, constructMetadata } from "@/lib/utils";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Footer from "@/components/Footer";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative flex flex-col min-h-screen">
            <TrpcProvider>
              <Navbar />
              <div className="flex-1 flex flex-col justify-center">
                {children}
              </div>
              <Footer />
            </TrpcProvider>
          </main>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
