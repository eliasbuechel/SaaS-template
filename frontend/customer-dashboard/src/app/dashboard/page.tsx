"use client";

import React, { useEffect, useState } from 'react';
import {NEXT_PUBLIC_AUTH_SERVICE_URL} from "@/lib/config";
import ShopifyConnectForm from "@/components/ShopifyConnectForm";
import {Tenant} from "@/types/Tenant";
import {fetchWithAuth} from "@/utils/auth";
import {User} from "@/types/User";


function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [tenants, setTenants] = useState<Array<Tenant>>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/status`);
                if (!res) return;
                
                if (res.status === 401) {
                    window.location.href = "/login";
                }

                const data = await res.json();

                if (!data.user) {
                    window.location.href = "/login";
                    return;
                }

                setUser(data.user);
                setTenants(data.tenants || []);
                setSelectedTenant(data.tenant);
                

                if (data.tenants) {
                    setTenants(data.tenants);
                    
                    if (data.tenants.length > 0) {
                        setSelectedTenant(data.tenants[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching auth status:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleTenantChange = async (tenantId: string) => {
        try {
            console.log(`Switching to tenant: ${tenantId}`);

            const res = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenant_id: tenantId }),
            });
            if (!res) return;

            if (res.ok) {
                console.info(`Switched to tenant ${tenantId}. Reloading data...`);
                setSelectedTenant(tenants.find((t) => t.id === tenantId) || null);
            } else {
                console.error("Failed to switch tenants.");
            }
        } catch (error) {
            console.error("Error switching tenants:", error);
        }
    };

    // useEffect(() => {
    //     fetch(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/status`, { credentials: 'include' })
    //         .then(res => {
    //             if (res.status === 401) {
    //                 window.location.href = '/login';
    //                 return Promise.reject(new Error('Unauthorized'));                    
    //             }
    //             return res.json()
    //         })
    //         .then(data => {
    //             if (data.user) {
    //                 setUser(data.user);
    //             } else {
    //                 window.location.href = '/login';
    //             }
    //            
    //             if (data.tenant) {
    //                 setTenant(data.tenant);
    //             } else {
    //                 window.location.href = '/connect-shopify';
    //             }
    //         })
    //         .catch(err => console.error('Error fetching auth status:', err));
    //    
    //     fetch(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/tenant`, { credentials: "include" })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.error) {
    //                 window.location.href = "/connect-shopify"
    //             } else {
    //                 setTenant(data);
    //             }
    //         });
    // }, []);

    if (!user) return <div>Loading...</div>;

    // return (
    //     <div>
    //         <h1>Welcome {user.created_at.toString()}</h1>
    //         {selectedTenant ? (
    //             <p>Connected to: {selectedTenant.shopifyStoreDomain}</p>
    //         ) : (
    //             <ShopifyConnectForm></ShopifyConnectForm>
    //         )}
    //     </div>
    // );

    return (
        <div>
            <h1>Welcome, {user.email}</h1>

            {tenants.length > 1 && (
                <div>
                    <label htmlFor="tenant-select">Select Shopify Store:</label>
                    <select
                        id="tenant-select"
                        onChange={(e) => handleTenantChange(e.target.value)}
                        value={selectedTenant?.id || ""}
                    >
                        {tenants.map((tenant) => (
                            <option key={tenant.id} value={tenant.id}>
                                {tenant.shopifyStoreDomain}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedTenant ? (
                <p>Connected to: {selectedTenant.shopifyStoreDomain}</p>
            ) : (
                <ShopifyConnectForm />
            )}
        </div>
    );
}

export default Dashboard;
