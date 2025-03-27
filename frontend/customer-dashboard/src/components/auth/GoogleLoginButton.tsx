"use client";

import React from "react";
import { Button } from "@shopify/polaris";
import {
  NEXT_PUBLIC_AUTH_SERVICE_URL,
  NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL,
} from "@/lib/config";

export default function GoogleLoginButton() {
  function loginWithGoogle() {
    window.location.href = `${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/google?redirectUrlAfterAuth=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/dashboard&redirectUrlAfterError=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/error`;
    console.log("Auth service url:", NEXT_PUBLIC_AUTH_SERVICE_URL);
  }

  return (
    <Button onClick={loginWithGoogle} variant="primary" fullWidth>
      Login with Google
    </Button>
  );
}
