import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import "@shopify/polaris/build/esm/styles.css";
import PolarisProvider from "@/utils/PolarisPrivider";

export const metadata: Metadata = {
  title: "SaaS template - customer-dashboard",
  description: "SaaS template project - customer-dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PolarisProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <footer>
              <p>© 2025 SaaS template</p>
            </footer>
          </AuthProvider>
        </PolarisProvider>
      </body>
    </html>
  );
}
