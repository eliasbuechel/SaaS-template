"use client";

import ShopifyConnectForm from "@/components/ShopifyConnectForm";
import SwitchTenant from "@/components/SwitchTenant";

export default function Dashboard() {
    return <>
        <h1>Connect to Shopify</h1>
        <h2>Select shop to continue with</h2>
        <SwitchTenant />
        <h2>Connect to new shop</h2>
        <ShopifyConnectForm />
    </>;
}