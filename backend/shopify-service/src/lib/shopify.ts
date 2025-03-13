import axios from "axios";

export const getShopifyProducts = async (shopifyStoreDomain: string, accessToken: string) => {
    const url = `https://${shopifyStoreDomain}/admin/api/2023-07/products.json`;

    try {
        const response = await axios.get(url, {
            headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
            }
        });
        return response.data.products;
    } catch (error: any) {
        console.error("Error fetching products from Shopify:", error.message);
        throw new Error("Failed to fetch products from Shopify");
    }
};
