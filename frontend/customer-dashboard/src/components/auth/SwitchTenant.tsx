"use client";

import React, {useCallback, useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {Select, SelectOption} from "@shopify/polaris"
import {Tenant} from "@/types/Tenant";

export default function SwitchTenant() {
    const { tenant, tenants, switchTenant } = useAuth();
    const [selected, setSelected] = useState<Tenant | null>(tenant);

    const options: SelectOption[] = tenants.map((tenant) => ({label: tenant.shopifyStoreDomain, value: tenant.id}));
    
    const handleSelectChange = useCallback(
        (value: string) => {
            const tenant: Tenant | undefined = tenants.find(t => t.id === value);
            
            if (!tenant) {
                console.error(`No tenant selectable for the value: ${value}`)
                return;
            }
            
            setSelected(tenant);
            switchTenant(tenant.id);
        },
        [],
    );
    
    if (!tenant) return <p>No shop connected yet</p>
    
    return (
        <div>
            <Select
                label="Active shop"
                onChange={handleSelectChange}
                value={selected?.id || ""}
                options={options}
            />
        </div>
    )
}