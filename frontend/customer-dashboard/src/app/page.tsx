"use client";

import {useAuth} from "@/context/AuthContext";
import { Page, Layout, Card, Button, Text } from "@shopify/polaris";

export default function HomePage() {
    const { user } = useAuth();
    const redirectToLogin = () => {
        window.location.href = "/login"
    }

    return (
        <Page title="Customer Dashboard">
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text variant="headingLg" as="h1">
                            Welcome to the Customer Dashboard
                        </Text>
                        {!user && (
                            <Button variant="primary" onClick={redirectToLogin}>
                                Login
                            </Button>
                        )}
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}