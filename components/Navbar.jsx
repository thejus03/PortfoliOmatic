"use client";
import { Box, HStack, Button, Avatar } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const getButtonStyles = useCallback((path) => {
        const isActive = pathname === path;
        
        return {
            color: isActive ? "blue.400" : "inherit",
            bgColor: isActive ? "blue.600/20" : "transparent",
            size: "sm",
            borderRadius: "md",
            paddingX: "1rem",
            fontWeight: isActive ? "bold" : "semibold",
            textStyle: "sm",
            _hover: {
                color: "blue.400",
                bgColor: "blue.600/20",
            },
        };
    }, [pathname]);

    const navigationItems = [
        { label: "Home", path: "/" },
        { label: "Portfolios", path: "/portfolios" },
        { label: "Buy/Sell", path: "/trade" }
    ];



    return (
        <div className="w-full h-16 bg-blue-900/90 backdrop-blur-sm border-b border-blue-800/50 flex items-center justify-center shadow-xl shadow-blue-950/50">
            <div className="w-[95%] flex items-center justify-between">
                <Box
                textStyle="xl"
                fontWeight="semibold"
                letterSpacing="wider"
                className="font-space-grotesk"
                color="white"
                >
                Portfoli-O-matic
                </Box>
                <HStack gap="2rem" justifySelf="flex-start" width="80%"  paddingX="2rem" className="font-sans">
                    {navigationItems.map((item) => (
                        <Button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            {...getButtonStyles(item.path)}
                        >
                            {item.label}
                        </Button>
                    ))}
                </HStack>
                <Avatar.Root size="sm" >
                    <Avatar.Fallback name="Segun Adebayo" />
                    <Avatar.Image src="https://bit.ly/sage-adebayo" />
                </Avatar.Root>
            </div>
        </div>
    )
}