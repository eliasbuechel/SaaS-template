import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import "@shopify/polaris/build/esm/styles.css";
import PolarisProvider from "@/utils/PolarisPrivider";
import {Box, Text} from "@shopify/polaris"

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
              <Box paddingBlockStart="200">
                <Text as="p">© 2025 SaaS template</Text>
              </Box>
            </footer>
          </AuthProvider>
        </PolarisProvider>
      </body>
    </html>
  );
}
