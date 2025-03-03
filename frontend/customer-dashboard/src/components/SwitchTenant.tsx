"use client";

import React from "react";
import {useAuth} from "@/context/AuthContext";

export default function SwitchTenant() {
    const { tenant, tenants, switchTenant } = useAuth();
    
    return (
        <div>
            <label htmlFor="tenant-select">Select Shopify Store:</label>
            <select
                id="tenant-select"
                onChange={(e) => switchTenant(e.target.value)}
                value={tenant?.id || ""}
            >
                {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                        {tenant.shopifyStoreDomain}
                    </option>
                ))}
            </select>
        </div>
    )
}