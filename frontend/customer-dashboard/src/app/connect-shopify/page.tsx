"use client";

import ShopifyConnectForm from "@/components/auth/ShopifyConnectForm";
import { BlockStack, Box, InlineStack } from "@shopify/polaris";
import { Button } from "@shopify/polaris";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { tenant } = useAuth();
  const onContinue = () => (window.location.href = "/dashboard");

  return (
    <BlockStack gap="500">
      <ShopifyConnectForm />
      <InlineStack align="center">
        {tenant ? (
          <Button onClick={onContinue}>
            Continue with {tenant.shopifyStoreDomain ?? ""}
          </Button>
        ) : (
          <Box />
        )}
      </InlineStack>
    </BlockStack>
  );
}
