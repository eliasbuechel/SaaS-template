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
} from "@shopify/polaris";
import {
  NEXT_PUBLIC_AUTH_SERVICE_URL,
  NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL,
} from "@/lib/config";
import { Text } from "@shopify/polaris";

export default function ShopifyConnectForm() {
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function shopifyConnect() {
    if (!shopName.trim()) {
      setError("Shop name is required.");
      return;
    }

    setError(null); // Clear previous errors

    window.location.href = `${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/shopify?shop=${encodeURIComponent(shopName)}&redirectUrlAfterAuth=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/dashboard&redirectUrlAfterError=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/error`;
  }

  return (
    <Page title="Shopify Connect">
      <Card>
        <Form onSubmit={shopifyConnect}>
          <FormLayout>
            <TextField
              id={"shopName"}
              label="Shopify Store Name"
              value={shopName}
              onChange={setShopName}
              placeholder="your-shop-name."
              autoComplete="off"
            />
            {error && <InlineError message={error} fieldID="shopNameError" />}
            <Button submit variant="primary" fullWidth>
              Connect to Shopify
            </Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}
