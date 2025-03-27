"use client";

import React from "react";
import { InlineStack, Text } from "@shopify/polaris";

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <InlineStack align="center">
      <Text as="h1" variant="heading3xl">
        {title}
      </Text>
    </InlineStack>
  );
};

export default PageTitle;
