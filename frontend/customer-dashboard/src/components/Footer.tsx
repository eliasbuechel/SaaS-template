"use client";

import React from "react";
import { Box, Divider, BlockStack, Text } from "@shopify/polaris";

export default function Footer() {
  return (
    <footer>
      <Box padding="500">
        <BlockStack gap="300">
          <Divider />
          <Box paddingBlockStart="200">
            <Text as="p">© 2025 SaaS template</Text>
          </Box>
        </BlockStack>
      </Box>
    </footer>
  );
}
