"use client";

import React, { useEffect, useState } from 'react';
import {nextPublicAuthServiceUrl} from "@/lib/config";

interface User {
    google_id: string;
    access_token: string;
    refresh_token: string;
    created_at: Date;
    updated_at: Date;
}

function Dashboard() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetch(`${nextPublicAuthServiceUrl}/api/auth/status`, { credentials: 'include' })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = '/login';
                    return Promise.reject(new Error('Unauthorized'));                    
                }
                return res.json()
            })
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    window.location.href = '/login';
                }
            })
            .catch(err => console.error('Error fetching auth status:', err));
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome {user.created_at.toString()}</h1>
            {/* Render your dashboard */}
        </div>
    );
}

export default Dashboard;
