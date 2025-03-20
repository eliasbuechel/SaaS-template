"use client";

import React from "react";
import Form from "next/form";
import {useState} from "react";
import {NEXT_PUBLIC_AUTH_SERVICE_URL, NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL} from "@/lib/config";


export default function ShopifyConnectForm() {
    const [shopName, setShopName] = useState("");
    
    function shopifyConnect() {
        if (!shopName) {
            return
        }

        window.location.href = `${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/shopify?shop=${encodeURIComponent(shopName)}&redirectUrlAfterAuth=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/dashboard&redirectUrlAfterError=${NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL}/error`;
    }
    
    return <Form action={shopifyConnect}>
        <span>Enter your Shopify Store Name:</span>
        <input value={shopName} type="text" onChange={(e) => setShopName(e.target.value)} />
        <button type="submit">Connect to Shopify</button>
    </Form>
}