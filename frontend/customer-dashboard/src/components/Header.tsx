"use client";

import React from "react";
import {
  Box,
  InlineStack,
  Button,
  Divider,
  BlockStack,
} from "@shopify/polaris";
import SwitchTenant from "@/components/auth/SwitchTenant";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import ShopManager from "@/components/auth/ShopManager";

export default function Header() {
  const { isAuthenticated, isLoading } = useAuth();
  const onConnectToShop = () => (window.location.href = "/connect-shopify");

  const showShopHandling = (): boolean =>
    isAuthenticated() && window.location.pathname !== "/connect-shopify";

  return (
    <Box padding="500">
      <BlockStack gap="300">
        <InlineStack wrap={false} align={"space-between"} gap="200">
          <ShopManager />
          <Navbar />
        </InlineStack>
        <Divider />
      </BlockStack>
    </Box>
  );
}
