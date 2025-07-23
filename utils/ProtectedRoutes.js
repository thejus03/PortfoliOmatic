'use client';
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoutes({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authState, setAuthState] = useState('unauthenticated');  
    
    useEffect(() => {
        // unprotected routes
        const publicRoutes = ['/', '/login', '/register'];
        
        if (publicRoutes.includes(pathname)) {
            setAuthState('authenticated');
            return;
        }
        
        // Check authentication for protected routes
        const token = localStorage.getItem('token');
        
        if (token) {
            setAuthState('authenticated');
        } else {
            setAuthState('unauthenticated');
            router.push('/login');
        }
    }, [pathname, router]);
    
    
    
    if (authState === 'unauthenticated') {
        return null;
    }
    
    return children;
}