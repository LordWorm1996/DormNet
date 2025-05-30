import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutController } from "@components/layout-controller";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App",
  description: "Application with global sidebar navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutController>{children}</LayoutController>
      </body>
    </html>
  );
}
