"use client";

import {useAuth} from "@/context/AuthContext";
import Link from "next/link";
import React from "react";

export default function Navbar() {
    const {user, logout} = useAuth();

    return (
        <nav>
            <Link href="/">Offers</Link>
            {!user ? (
                <Link href="/login">Login</Link>
            ) : (
                <>
                    <Link href="/dashboard">Dashboard</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    )
}