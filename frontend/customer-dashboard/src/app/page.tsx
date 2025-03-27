"use client";

import { BlockStack } from "@shopify/polaris";
import PageTitle from "@/components/PageTitle";

export default function HomePage() {
  return (
    <BlockStack gap="500">
      <PageTitle title="Offers" />
    </BlockStack>
  );
}
