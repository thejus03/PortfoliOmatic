'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }) {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }
    }, [router]);
    return children;
}