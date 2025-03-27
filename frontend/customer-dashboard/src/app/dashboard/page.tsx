"use client";

import { useAuth } from "@/context/AuthContext";
import { InlineStack, Spinner, Text } from "@shopify/polaris";
import PageTitle from "@/components/PageTitle";

function Dashboard() {
  const { user } = useAuth();

  if (!user)
    return (
      <InlineStack gap="300">
        <Spinner />
        <Text as="p">Loading user data...</Text>
      </InlineStack>
    );

  return <PageTitle title={`Welcome ${user.email}`} />;
}

export default Dashboard;
