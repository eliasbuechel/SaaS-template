"use client";

import {
  Page,
  Card,
  Text,
  Form,
  Button,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";
import React from "react";
import {
  NEXT_PUBLIC_AUTH_SERVICE_URL,
  NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL,
} from "@/lib/config";

export default function LoginForm() {
  function loginWithGoogle() {
    window.location.href = `${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/google?redirectUrlAfterAuth=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/dashboard&redirectUrlAfterError=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/error`;
  }

  return (
    <Page narrowWidth>
      <Card padding="1000" background="bg-surface-emphasis">
        <Form name={"Sign in to your Account"} onSubmit={loginWithGoogle}>
          <InlineStack align="center">
            <BlockStack gap="300">
              <Text as="h1" variant="headingLg">
                Sign in to your Account
              </Text>
              <Text as="p">Please log in using one of the options below.</Text>
              <Button
                submit
                variant="primary"
                accessibilityLabel={"Login with Google"}
              >
                Login with Google
              </Button>
            </BlockStack>
          </InlineStack>
        </Form>
      </Card>
    </Page>
  );
}
