"use client";
import { Box, HStack, Button, Avatar, Menu, Portal, Dialog, CloseButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { LuLogOut } from "react-icons/lu";
import { deleteUserAccount } from "@/app/apis/portfolio";
import { userPortfolioExists } from "@/app/apis/auth";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const getButtonStyles = useCallback((path) => {
        const isActive = pathname === path;
        
        return {
            color: isActive ? "blue.400" : "inherit",
            bgColor: isActive ? "blue.600/20" : "transparent",
            size: "xs",
            borderRadius: "xs",
            paddingX: "1rem",
            fontWeight: isActive ? "bold" : "semibold",
            textStyle: "sm",
            _hover: {
                color: "blue.400",
                bgColor: "blue.600/20",
            },
            transition: "all 0.2s ease-in-out",
        };
    }, [pathname]);

    const navigationItems = [
        { label: "Home", path: "/home" },
        { label: "Portfolios", path: "/portfolios" },
        { label: "Buy/Sell", path: "/trade" }
    ];

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (token) {
            const fetchUserPortfolioExists = async () => {
                try {
                    const response = await userPortfolioExists(token);
                    setIsAuthenticated(response);
                } catch (error) {
                    console.error("Error checking user portfolio:", error);
                    setIsAuthenticated(false);
                }
            }
            fetchUserPortfolioExists();
        }
        
    }, []);

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
                PortfoliOmatic
                </Box>
                {pathname.includes("/login") ? (
                   <HStack gap="2rem" width="80%" paddingX="2rem" className="font-sans" justifyContent="flex-end">
                   <Button 
                       onClick={() => router.push("/register")}
                       variant="outline"
                       size="sm"
                       color="blue.300"
                       bgColor="blue.500/20"
                       paddingX="1.5rem"
                       paddingY="1.25rem"
                       _hover={{
                           borderRadius: "full",
                       }}
                       className="font-space-grotesk tracking-wide"
                       fontWeight="medium"
                   >
                       Sign Up
                   </Button>
               </HStack>  
                ) : (
                    pathname.includes("/register") ? (
                        <HStack gap="2rem" width="80%" paddingX="2rem" className="font-sans" justifyContent="flex-end">
                        <Button 
                            onClick={() => router.push("/login")}
                            variant="outline"
                            size="sm"
                            color="blue.300"
                            bgColor="blue.500/20"
                            paddingX="1.5rem"
                            paddingY="1.25rem"
                            _hover={{
                                borderRadius: "full",
                            }}
                            className="font-space-grotesk tracking-wide"
                            fontWeight="medium"
                        >
                            Login
                        </Button>
                    </HStack> 
                    ) : (
                        <div className="flex items-center justify-between w-[80%] px-8">
                        <HStack gap="2rem" className="font-sans">
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
                        <Menu.Root positioning={{ placement: "bottom-start" }}>
                            <Menu.Trigger rounded="full" focusRing="none">
                                <Avatar.Root size="sm">
                                <Avatar.Fallback name="" />
                                </Avatar.Root>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                <Menu.Content
                                    bgColor="blue.900/40"
                                    backdropFilter="blur(10px)"
                                    border="1px solid"
                                    borderColor="blue.800/50"
                                    borderRadius="sm"
                                >
                                    <Menu.ItemGroup>
                                        <Menu.Item value="delete" onClick={() => setOpen(true)}>
                                            Delete Account
                                        </Menu.Item>
                                        <Menu.Item value="logout" onClick={() => {
                                            localStorage.removeItem("token");
                                            router.push("/login");
                                        }}>
                                            <LuLogOut />
                                            Logout
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </div> 
                    ))}
                
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                            <Dialog.Title>Delete Account</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                Are you sure you want to delete your account? This action is irreversible.
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Button 
                                padding={2} 
                                _hover={{bg:"blue.800"}}
                                onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    padding={2}
                                    _hover={{bg:"red.800"}}
                                    onClick={async () => {
                                        const result = await deleteUserAccount(localStorage.getItem("token"));
                                        if (result.success) {
                                            localStorage.removeItem("token");
                                            router.push("/register");
                                        } else {
                                            console.error("Deletion failed:", result.error);
                                            alert("Failed to delete account");
                                        }
                                    }}
                                >
                                    Confirm Delete
                                </Button>
                            </Dialog.Footer>

                            <CloseButton
                            size="sm"
                            position="absolute"
                            top={2}
                            right={2}
                            onClick={() => setOpen(false)}
                            />

                        </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </div>
        </div>
    )
}