import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SaaS template",
    description: "SaaS template project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <header>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/login">Login</Link>
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