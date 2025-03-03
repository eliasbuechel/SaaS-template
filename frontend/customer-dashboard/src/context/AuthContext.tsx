"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchWithAuth } from "@/utils/auth";
import {User} from "@/types/User";
import log from "loglevel";
import {Tenant} from "@/types/Tenant";
import {NEXT_PUBLIC_AUTH_SERVICE_URL} from "@/lib/config";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    tenant: Tenant | null;
    tenants: Array<Tenant>;
    switchTenant: (tenantId: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [tenants, setTenants] = useState<Array<Tenant>>([]);
    
    useEffect(() => {
        async function loadUser(): Promise<void> {
            try {
                const res: Response = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/user`);
                if (!res.ok) throw new Error(`Response status ${res.status} not expected`);
                setUser(await res.json());
            } catch (error) {
                log.error("Error fetching user", error);
                setUser(null);
            }
        }

        async function loadTenant(): Promise<void> {
            try {
                const res: Response = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/tenant`);
                if (!res.ok) throw new Error(`Response status ${res.status} not expected`);
                setTenant(await res.json());
            } catch (error) {
                log.error("Error fetching tenant", error);
                setTenant(null);
            }
        }

        async function loadTenants(): Promise<void> {
            try {
                const res: Response = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/tenant/all`);
                if (!res.ok) throw new Error(`Response status ${res.status} not expected`);
                setTenants(await res.json());
            } catch (error) {
                log.error("Error fetching tenant", error);
                setTenants([]);
            }
        }
        
        async function loadData() {
            try {
                const authRes = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/status`);
                
                if (authRes.status === 401) {
                    setUser(null);
                    setTenant(null);
                    setTenants([]);

                    if (window.location.pathname === "/") return;
                    if (window.location.pathname === "/error") return;
                    if (window.location.pathname !== "/login") window.location.href = "/login";
                    return;
                }
                
                await loadUser();

                if (authRes.status === 403) {
                    setTenant(null);
                    setTenants([]);

                    if (window.location.pathname === "/") return;
                    if (window.location.pathname === "/error") return;
                    if (window.location.pathname !== "/connect-shopify") window.location.href = "/connect-shopify";
                    return;
                }

                if (!authRes.ok) throw new Error(`Error fetching auth status. Response status ${authRes.status} not expected`);
                if (window.location.pathname === "/login" || window.location.pathname === "/connect-shopify") window.location.href = "/dashboard";
                
                await loadTenant();
                await loadTenants();
            } catch (error) {
                log.error("Error while loading auth data", error)
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    }, []);

    const logout = async () => {
        setUser(null);
        setTenant(null);
        setTenants([]);

        await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/logout`, { method: "DELETE" });
        log.info("Logged out")
        window.location.reload();
    };
    
    const switchTenant = async (tenantId: string | null) => {
        const tenantToSwitchTo: Tenant | undefined = tenants.find((t) => t.id === tenantId);
        if (!tenant) {
            log.error("Tenant not found. Invalid tenantId to switch tenant");
            return;
        }
        
        const res = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/shopify/switch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tenantId }),
        });

        if (res.status === 401) window.location.href = "/login";
        if (res.status === 403) window.location.href = "/connect-shopify";

        if (res.ok) {
            setTenant(tenantToSwitchTo!);
            log.info(`Switched to tenant ${tenantId}. Reloading data...`);
            window.location.reload();
        } else {
            log.error("Failed to switch to tenant: ", tenantId);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout, tenant, tenants, switchTenant }}>
            { loading ? ("loading...") : (children) }
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context: AuthContextType | undefined = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}