import { Link, Text, BlockStack } from "@shopify/polaris";
import React from "react";

interface NavigationLinkProps {
  url: string;
  label: string;
  isActive?: boolean;
  isEnabled?: boolean;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  url,
  label,
  isActive = false,
  isEnabled = true,
}) => {
  if (!isEnabled || isActive) {
    return (
      <BlockStack align="center">
        <Text
          as="p"
          fontWeight={isActive ? "bold" : undefined}
          variant="bodyLg"
        >
          {label}
        </Text>
      </BlockStack>
    );
  }

  return (
    <BlockStack align="center">
      <Link monochrome url={url} removeUnderline>
        <Text as="p" variant="bodyLg">
          {label}
        </Text>
      </Link>
    </BlockStack>
  );
};

export default NavigationLink;
