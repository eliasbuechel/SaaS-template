import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SaaS template - customer-dashboard",
    description: "SaaS template project - customer-dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <header>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/login">Login</Link>
                <Link href="/connect-shopify">Connect shopify</Link>
            </nav>
        </header>
        <main>{children}</main>
        <footer>
            <p>© 2025 SaaS template</p>
        </footer>
        </body>
        </html>
    );
}