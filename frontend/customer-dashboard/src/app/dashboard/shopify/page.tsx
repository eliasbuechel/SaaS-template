"use client";

import {useEffect, useState} from "react";
import {fetchWithAuth} from "@/utils/auth";
import {NEXT_PUBLIC_SHOPIFY_SERVICE_URL} from "@/lib/config";
import log from "loglevel";

interface Order {
    id: string;
}


function Shopify() {
    const [ orders, setOrders ] = useState<Array<Order>>([]);

    useEffect(() => {
        async function loadOrders(): Promise<void> {
            try {
                const res: Response = await fetchWithAuth(`${NEXT_PUBLIC_SHOPIFY_SERVICE_URL}/api/orders`);
                if (!res.ok) throw new Error(`Response status ${res.status} not expected.`);
                setOrders(await res.json());
            } catch (error) {
                log.error("Error fetching orders from shopify", error);
                setOrders([]);
            }
        }
        
        loadOrders();
    });

    if (!orders) return <div>Loading...</div>;

    return (
        <div>
            <h1>Orders</h1>
            <ul>
                {orders.map((order, index) => <li key={index}>{order.id}</li>)}
            </ul>
        </div>
    );
}

export default Shopify;