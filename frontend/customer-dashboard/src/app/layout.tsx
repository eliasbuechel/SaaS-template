import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import "@shopify/polaris/build/esm/styles.css";
import PolarisProvider from "@/utils/PolarisPrivider";
import { BlockStack } from "@shopify/polaris";
import Footer from "@/components/Footer";

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
            <BlockStack gap="500" align="space-between">
              <Header />
              <main>{children}</main>
              <Footer />
            </BlockStack>
          </AuthProvider>
        </PolarisProvider>
      </body>
    </html>
  );
}
