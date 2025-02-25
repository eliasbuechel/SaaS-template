"use client";

import React from "react";
import {nextPublicAuthServiceUrl} from "@/lib/config";


export default function ShopifyConnectForm() {
    function loginWithGoogle() {
        window.location.href = `${nextPublicAuthServiceUrl}/api/google/auth`;
        console.log('Auth service url: ', nextPublicAuthServiceUrl);
    }

    return <button onClick={loginWithGoogle}>Login with Google</button>
}