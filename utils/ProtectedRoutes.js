'use client';
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (pathname === "/") {
            return 
        }
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }
    }, [router]);
    return children;
}