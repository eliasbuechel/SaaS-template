"use client";

import React, { useState } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  InlineError,
  Page,
  BlockStack,
} from "@shopify/polaris";
import {
  NEXT_PUBLIC_AUTH_SERVICE_URL,
  NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL,
} from "@/lib/config";

export default function ShopifyConnectForm() {
  const SHOPIFY_SHOP_NAME_ENDING = ".myshopify.com";

  const [shopName, setShopName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function shopifyConnect() {
    if (!shopName.trim()) {
      setError("Shop name is required.");
      return;
    }

    if (
      shopName.includes(".") &&
      !shopName.endsWith(SHOPIFY_SHOP_NAME_ENDING)
    ) {
      setError(
        `Shop name has to end with ${SHOPIFY_SHOP_NAME_ENDING} or or just the shop name.`,
      );
      return;
    }

    setError(null);

    window.location.href = `${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/shopify?shop=${encodeURIComponent(shopName)}&redirectUrlAfterAuth=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/dashboard&redirectUrlAfterError=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/error`;
  }

  return (
    <Page title="Connect to your shopify shop">
      <Card>
        <Form onSubmit={shopifyConnect}>
          <FormLayout>
            <BlockStack gap="300">
              <TextField
                id={"shopName"}
                label="Shopify Store Name"
                value={shopName}
                onChange={setShopName}
                placeholder="your-shop-name.myshopify.com"
                autoComplete="off"
              />
              {error && <InlineError message={error} fieldID="shopNameError" />}
              <Button submit variant="primary" fullWidth>
                Connect to Shopify
              </Button>
            </BlockStack>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}
