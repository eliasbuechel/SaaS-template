"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ErrorContent() {
    const { user, tenant } = useAuth();

    const searchParams = useSearchParams();

    const code = searchParams.get("code") || "500";
    const message = searchParams.get("message") || "Something went wrong";
    const details =
        searchParams.get("details") ||
        "An unexpected error occurred. Please try again later.";
    const timestampParam =
        searchParams.get("timestamp") || new Date().toISOString();
    const path = searchParams.get("path") || "Unknown path";

    const [formattedTimestamp, setFormattedTimestamp] =
        useState<string>("Loading...");

    useEffect(() => {
        setFormattedTimestamp(new Date(timestampParam).toLocaleString());
    }, [timestampParam]);

    return (
        <Suspense fallback={<div>Loading error details...</div>}>
            <div>
                <h1>
                    {code}: {message}
                </h1>
                <p>{details}</p>
                <p>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(formattedTimestamp).toLocaleString()}
                </p>
                <p>
                    <strong>Path:</strong> {path}
                </p>
                <Link href="/">Go back home</Link>
                {user && (
                    <p>
                        <strong>User:</strong> {user.email}
                    </p>
                )}
                {tenant && (
                    <p>
                        <strong>Tenant:</strong> {tenant.shopifyStoreDomain}
                    </p>
                )}
            </div>
        </Suspense>
    );
}