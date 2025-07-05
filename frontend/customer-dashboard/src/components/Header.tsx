"use client";

import React from "react";
import {
  Box,
  InlineStack,
  Divider,
  BlockStack,
} from "@shopify/polaris";
import Navbar from "@/components/Navbar";
import ShopManager from "@/components/auth/ShopManager";

export default function Header() {
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
