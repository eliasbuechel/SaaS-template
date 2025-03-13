"use client";

import {useAuth} from "@/context/AuthContext";


function Dashboard() {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
        </div>
    );
}

export default Dashboard;