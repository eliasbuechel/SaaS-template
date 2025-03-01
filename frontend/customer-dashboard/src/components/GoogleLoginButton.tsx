"use client";

import React from "react";
import {NEXT_PUBLIC_AUTH_SERVICE_URL} from "@/lib/config";


export default function GoogleLoginButton() {
    function loginWithGoogle() {
        window.location.href = `${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/google/auth`;
        console.log('Auth service url: ', NEXT_PUBLIC_AUTH_SERVICE_URL);
    }

    return <button onClick={loginWithGoogle}>Login with Google</button>
}