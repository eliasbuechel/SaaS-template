"use client";

import React from "react";
import { Box, InlineStack, Button, BlockStack } from "@shopify/polaris";
import SwitchTenant from "@/components/auth/SwitchTenant";
import { useAuth } from "@/context/AuthContext";

export default function ShopManager() {
  const { isAuthenticated, tenant } = useAuth();
  const onConnectToDifferentShop = () =>
    (window.location.href = "/connect-shopify");

  const isOnConnectShopifyPage =
    window.location.pathname === "/connect-shopify";

  if (isAuthenticated())
    return (
      <InlineStack gap="200">
        {tenant ? <SwitchTenant /> : null}
        {!isOnConnectShopifyPage ? (
          <BlockStack align="center">
            <Button variant="secondary" onClick={onConnectToDifferentShop}>
              Connect to different shop
            </Button>
          </BlockStack>
        ) : null}
      </InlineStack>
    );

  return <Box />;
}
