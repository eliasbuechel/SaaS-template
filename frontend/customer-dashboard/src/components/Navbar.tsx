"use client";

import { useAuth } from "@/context/AuthContext";
import { Button, InlineStack } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import NavigationLink from "@/components/NavigationLInk";

export default function Navbar() {
  const { user, logout, tenant } = useAuth();

  const OFFERS_URL = "/";
  const LOGIN_URL = "/login";
  const DASHBOARD_URL = "/dashboard";
  const DASHBOARD_SHOP_URL = `/dashboard/shop`;
  const CONNECT_TO_SHOPIFY_SHOP_URL = `/connect-shopify`;

  const [pathname, setPathname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  const isOffersPage: boolean = pathname === OFFERS_URL;
  const isLoginPage: boolean = pathname === LOGIN_URL;
  const isDashboardPage: boolean = pathname === DASHBOARD_URL;
  const isDashboardShopifyPage: boolean = pathname === DASHBOARD_SHOP_URL;
  const isConnectToShopifyShopPage: boolean =
    pathname === CONNECT_TO_SHOPIFY_SHOP_URL;

  return (
    <nav>
      <InlineStack gap="300" align="center">
        <NavigationLink
          url={OFFERS_URL}
          label="Offers"
          isActive={isOffersPage}
          isEnabled={!isOffersPage}
        />
        {!user ? (
          <NavigationLink
            url={LOGIN_URL}
            label="Login"
            isActive={isLoginPage}
            isEnabled={!isLoginPage}
          />
        ) : (
          <>
            {!tenant ? (
              <NavigationLink
                url={CONNECT_TO_SHOPIFY_SHOP_URL}
                label="Connect to Shopify shop"
                isActive={isConnectToShopifyShopPage}
                isEnabled={!isConnectToShopifyShopPage}
              />
            ) : (
              <>
                <NavigationLink
                  url={DASHBOARD_URL}
                  label="Dashboard"
                  isActive={isDashboardPage}
                  isEnabled={!isDashboardPage}
                />

                <NavigationLink
                  url={DASHBOARD_SHOP_URL}
                  label="Shop"
                  isActive={isDashboardShopifyPage}
                  isEnabled={!isDashboardShopifyPage}
                />
              </>
            )}
            <Button variant={"secondary"} onClick={logout} size="large">
              Logout
            </Button>
          </>
        )}
      </InlineStack>
    </nav>
  );
}
