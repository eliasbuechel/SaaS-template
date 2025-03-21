"use client";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { Page, Layout, Card, Button, Text } from "@shopify/polaris";

export default function Login() {
    return (
        <Page title="Customer Login" narrowWidth>
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text variant="headingLg" as="h1">
                            Sign in to your Account
                        </Text>
                        <Text as="p">
                            Please log in using Google to access your account.
                        </Text>
                        <div style={{ marginTop: "1rem" }}>
                            <GoogleLoginButton />
                        </div>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}