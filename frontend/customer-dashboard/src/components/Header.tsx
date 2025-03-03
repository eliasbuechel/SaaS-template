"use client";

import SwitchTenant from "@/components/SwitchTenant";
import ShopifyConnectForm from "@/components/ShopifyConnectForm";
import React from "react";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/context/AuthContext";

export default function Header() {
    const { user } = useAuth();
    
    return (
        <header>
            <Navbar/>
            {user && <SwitchTenant/>}
            {user && <ShopifyConnectForm/>}
        </header>
    )
}