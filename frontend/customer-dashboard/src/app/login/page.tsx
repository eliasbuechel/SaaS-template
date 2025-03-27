"use client";

import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { BlockStack } from "@shopify/polaris";
import PageTitle from "@/components/PageTitle";

export default function Login() {
  return (
    <BlockStack gap="500">
      <PageTitle title="Login" />
      <LoginForm />;
    </BlockStack>
  );
}
