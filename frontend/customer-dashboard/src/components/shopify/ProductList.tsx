"use client";

import { useProducts } from "@/hooks/useProducts";
import {
  Card,
  Page,
  Button,
  IndexTable,
  Text,
  Spinner,
} from "@shopify/polaris";
import { IndexTableHeading } from "@shopify/polaris/build/ts/src/components/IndexTable";
import { NonEmptyArray } from "@shopify/polaris/build/ts/src/types";
import ProductOverview from "@/components/shopify/PruductOverview";
import { Product } from "@/types/shopify/Product";
import { useEffect, useState } from "react";

function ProductList() {
  const { products, isLoading, reload } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  );

  useEffect(() => {
    if (selectedProduct && !products.some(p => selectedProduct.id === p.id))
      setSelectedProduct(undefined);
  }, [products, selectedProduct]);

  if (isLoading) {
    return (
      <Page title="Products">
        <Card>
          <Spinner accessibilityLabel="Loading products" size="large" />
        </Card>
      </Page>
    );
  }

  const headings: NonEmptyArray<IndexTableHeading> = [
    { title: "ID" },
    { title: "Title" },
    { title: "Vendor" },
    { title: "Product Type" },
    { title: "Status" },
    { title: "Price Range" },
  ];

  return (
    <Page title="Products">
      <Button onClick={reload}>Reload</Button>
      <Card>
        {products.length === 0 ? (
          <Text as="p">No products available.</Text>
        ) : (
          <IndexTable
            resourceName={{ singular: "product", plural: "products" }}
            itemCount={products.length}
            headings={headings}
            selectable={false}
          >
            {products.map((product, index) => (
              <IndexTable.Row
                id={product.id.toString()}
                key={product.id}
                position={index}
                onClick={() => setSelectedProduct(product)}
              >
                <IndexTable.Cell>{product.id}</IndexTable.Cell>
                <IndexTable.Cell>{product.title}</IndexTable.Cell>
                <IndexTable.Cell>{product.vendor}</IndexTable.Cell>
                <IndexTable.Cell>{product.product_type}</IndexTable.Cell>
                <IndexTable.Cell>{product.status}</IndexTable.Cell>
                <IndexTable.Cell>
                  CHF{" "}
                  {Math.min(
                    ...product.variants.map((v) => parseFloat(v.price)),
                  )}{" "}
                  - CHF{" "}
                  {Math.max(
                    ...product.variants.map((v) => parseFloat(v.price)),
                  )}
                </IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        )}
      </Card>
      {selectedProduct && <ProductOverview product={selectedProduct} />}
    </Page>
  );
}

export default ProductList;
