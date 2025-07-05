"use client";

import React, { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectOption } from "@shopify/polaris";
import { Tenant } from "@/types/Tenant";

export default function SwitchTenant() {
  const { tenant, tenants, switchTenant } = useAuth();
  const [selected, setSelected] = useState<Tenant | null>(tenant);

  const options: SelectOption[] = tenants.map((tenant) => ({
    label: tenant.shopifyStoreDomain.slice(0, -".myshopify.com".length),
    value: tenant.id,
  }));

  const handleSelectChange = useCallback(
    (tenantId: string) => {
      const tenant: Tenant | undefined = tenants.find((t) => t.id === tenantId);

      if (!tenant) {
        console.error(`No tenant selectable for the value: ${tenantId}`);
        return;
      }

      setSelected(tenant);
      switchTenant(tenant.id);
    },
    [tenants, switchTenant],
  );

  if (!tenant) return <p>No shop connected yet</p>;

  return (
    <div>
      <Select
        label="Shop: "
        labelInline
        onChange={handleSelectChange}
        value={selected?.id || ""}
        options={options}
      />
    </div>
  );
}
