"use client";

import ShopifyConnectForm from "@/components/ShopifyConnectForm";
import {fetchWithAuth} from "@/utils/auth";
import {NEXT_PUBLIC_AUTH_SERVICE_URL} from "@/lib/config";

export default function Dashboard() {
    const fetchUserData = async () => {
        try {
            const res = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/status`);
            if (!res) return;
            if (res.status === 401) window.location.href = "/login";
            if (res.status === 403) return;
            if (res.ok) window.location.href = "/dashboard";
        } catch (error) {
            console.error("Error fetching auth status:", error);
        }
    }
    
    fetchUserData();
    
    return <>
        <h1>Connect to Shopify</h1>
        <ShopifyConnectForm></ShopifyConnectForm>
    </>;
}