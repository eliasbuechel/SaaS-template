"use client";

import GoogleLoginButton from "@/components/GoogleLoginButton";
import {useEffect} from "react";
import {NEXT_PUBLIC_AUTH_SERVICE_URL} from "@/lib/config";
import {fetchWithAuth} from "@/utils/auth";

export default function Login() {
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetchWithAuth(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/status`);
                if (!res) return;
                if (res.status === 401) return
                if (res.ok) window.location.href = "/dashboard";
            } catch (error) {
                console.error("Error fetching auth status:", error);
            }
        }
        
        fetchUserData()
    }, []);
    
    return <>
        <h1>Customer Login</h1>
        <GoogleLoginButton></GoogleLoginButton>
    </>;
}