"use client";

import React from "react";
import Form from "next/form";
import {useState} from "react";
import {NEXT_PUBLIC_AUTH_SERVICE_URL} from "@/lib/config";


export default function ShopifyConnectForm() {
    const [shopName, setShopName] = useState("");
    
    function shopifyConnect() {
        if (!shopName) {
            return
        }

        fetch(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/shopify/auth?shop=${encodeURIComponent(shopName)}`, {credentials: "include"})
            .then(response => response.json())
            .then(data => {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl; // ✅ Manually redirect after authentication
                } else {
                    console.error("Error: No redirect URL provided", data);
                }
            })
            .catch(error => console.error("Shopify Auth Error:", error));


        console.log('Connecting to the shop: ', shopName);
        console.log('Auth service url: ', NEXT_PUBLIC_AUTH_SERVICE_URL);
    }
    
    return <Form action={shopifyConnect}>
        <span>Enter your Shopify Store Name:</span>
        <input value={shopName} type="text" onChange={(e) => setShopName(e.target.value)} />
        <button type="submit">Connect to Shopify</button>
    </Form>
}