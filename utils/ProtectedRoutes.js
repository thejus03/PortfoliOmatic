'use client';
import { useRouter } from "next/navigation";

export default function ProtectedRoutes({ children }) {
    const router = useRouter();
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
    }
    return children;
}