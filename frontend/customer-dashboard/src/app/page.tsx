"use client";

import {useAuth} from "@/context/AuthContext";

export default function Page() {
    const { user } = useAuth();
    const redirectToLogin = () => {
        window.location.href = "/login"
    }
    
    return (
        <>
            <h1>Welcome to customer-dashboard</h1>
            {!user && <button onClick={redirectToLogin}>Login</button>}
        </>
    )
}