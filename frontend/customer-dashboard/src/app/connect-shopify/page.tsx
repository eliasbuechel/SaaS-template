"use client";

import ShopifyConnectForm from "@/components/auth/ShopifyConnectForm";
import {BlockStack, InlineStack} from "@shopify/polaris";
import SwitchTenant from "@/components/auth/SwitchTenant";
import { Button } from "@shopify/polaris";

export default function Dashboard() {
    const onContinue = () => window.location.href = "/dashboard";
    
    return <BlockStack>
        <InlineStack align="center" gap="025">
            <SwitchTenant/>
            <Button onClick={onContinue}>Continue with selected Shop</Button>
        </InlineStack>
        <ShopifyConnectForm/>
    </BlockStack>;
}