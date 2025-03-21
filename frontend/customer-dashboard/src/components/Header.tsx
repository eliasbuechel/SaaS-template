"use client";

import React from "react";
import { Box, InlineStack, Button } from "@shopify/polaris";
import SwitchTenant from "@/components/auth/SwitchTenant";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/context/AuthContext";

export default function Header() {
    const { isAuthenticated } = useAuth();
  const onConnectToShop = () => (window.location.href = "/connect-shopify");
  
const showShopHandling = (): boolean => isAuthenticated() && window.location.pathname !== "/connect-shopify";

  return (
    <Box padding="200">
      <InlineStack wrap={false} align={"space-between"} gap="200">
        <Navbar/>
        { showShopHandling() && (
          <InlineStack gap="200">
            <SwitchTenant />
            <Button variant={"secondary"} onClick={onConnectToShop}>
              Connect to different shop
            </Button>
          </InlineStack>
        )}
      </InlineStack>
    </Box>
  );
}
