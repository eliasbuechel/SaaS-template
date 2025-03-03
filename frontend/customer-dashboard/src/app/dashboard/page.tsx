"use client";

import ShopifyConnectForm from "@/components/ShopifyConnectForm";
import {useAuth} from "@/context/AuthContext";
import SwitchTenant from "@/components/SwitchTenant";


function Dashboard() {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
        </div>
    );
}

export default Dashboard;