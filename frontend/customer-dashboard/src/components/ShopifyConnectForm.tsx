"use client";

import React from "react";
import Form from "next/form";
import {useState} from "react";
import {nextPublicAuthServiceUrl} from "@/lib/config";


export default function ShopifyConnectForm() {
    const [shopName, setShopName] = useState("");
    
    function shopifyConnect() {
        if (!shopName) {
            return
        }
        
        window.location.href = `${nextPublicAuthServiceUrl}/api/shopify/auth?shop=${encodeURIComponent(shopName)}`;

        console.log('Connecting to the shop: ', shopName);
        console.log('Auth service url: ', nextPublicAuthServiceUrl);
    }
    
    return <Form action={shopifyConnect}>
        <span>Enter your Shopify Store Name:</span>
        <input value={shopName} type="text" onChange={(e) => setShopName(e.target.value)} />
        <button type="submit">Connect to Shopify</button>
    </Form>
}