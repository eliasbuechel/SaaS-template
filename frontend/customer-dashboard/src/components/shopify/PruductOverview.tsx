import React from "react";
import { Card, Text, Layout, Page, Thumbnail, ResourceList } from "@shopify/polaris";
import {Product} from "@/types/shopify/Product";

interface ProductOverviewProps {
    product: Product;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
    return (
        <Page title="Product Overview">
            <Layout>
                <Layout.Section>
                    <Card>
                        <div style={{ textAlign: "center", padding: "20px" }}>
                            {product.image && (
                                <Thumbnail
                                    source={product.image.src}
                                    alt={product.image.alt || "Product Image"}
                                    size="large"
                                />
                            )}
                            <Text variant="headingLg" as="h2">{product.title}</Text>
                            <Text as="p">{product.body_html}</Text>
                            <Text as="p">Vendor: {product.vendor}</Text>
                            <Text as="p">Type: {product.product_type}</Text>
                        </div>
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <Card>
                        <ResourceList
                            resourceName={{ singular: "variant", plural: "variants" }}
                            items={product.variants.map((variant) => ({
                                id: variant.id.toString(),
                                title: variant.title,
                                price: `CHF ${variant.price}`,
                                stock: variant.inventory_quantity,
                            }))}
                            renderItem={(item) => {
                                const { id, title, price, stock } = item;
                                return (
                                    <ResourceList.Item id={id} key={id} accessibilityLabel={`View details for ${title}`} onClick={() => {}}>
                                        <Text variant="headingMd" as="h2" >{title}</Text>
                                        <Text as="p">Price: {price}</Text>
                                        <Text as="p">Stock: {stock}</Text>
                                    </ResourceList.Item>
                                );
                            }}
                        />
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default ProductOverview;