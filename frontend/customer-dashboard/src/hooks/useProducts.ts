import { useState, useEffect } from "react";
import { Product } from "@/types/shopify/Product";
import {fetchWithAuth} from "@/utils/auth";
import {NEXT_PUBLIC_SHOPIFY_SERVICE_URL} from "@/lib/config";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function loadProducts(): Promise<void> {
        try {
            const res: Response = await fetchWithAuth(`${NEXT_PUBLIC_SHOPIFY_SERVICE_URL}/api/products`);
            if (!res.ok) throw new Error(`Response status ${res.status} not expected.`);
            if (!res.body) throw new Error(`Response status ${res.status} not found`);

            const responseData = await res.json();
            const products = responseData.products as Product[];
            
            console.info(`Retrieved ${products.length} products from Shopify`);
            setProducts(products);
        } catch (error) {
            console.error("Error fetching products from Shopify:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return { products, isLoading, reload: loadProducts };
}
