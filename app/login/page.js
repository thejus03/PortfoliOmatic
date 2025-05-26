"use client";
import React from "react";
import {
  Button,
  Box,
  Card,
  HStack,
  VStack,
  Image,
  Input,
  InputGroup,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { LuMail, LuLock, LuShieldAlert } from "react-icons/lu";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
});

function Login() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <VStack>
        {/* Navbar */}
        <div className="w-full h-16 bg-slate-800 flex items-center justify-center shadow-md">
          <div className="w-[95%] flex items-center justify-between">
            <Box
              textStyle="xl"
              fontWeight="semibold"
              letterSpacing="wider"
              className={spaceGrotesk.className}
            >
              Portfoli-O-matic
            </Box>
            <Button onClick={() => router.push("/register")} olorPalette="blue" variant="ghost" size="md" rounded="lg">
              Sign Up
            </Button>
          </div>
        </div>
      </VStack>

      <VStack marginTop="32">
        {/* Login Card */}
        <Box>
          <Card.Root
            flexDirection="row"
            overflow="hidden"
            maxW="5xl"
            rounded="xl"
            shadow="lg"
            bg="#1E293B"
          >
            <Image
              objectFit="cover"
              maxW="400px"
              src="https://images.unsplash.com/photo-1647331311387-9cca489b53f2?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="stocks"
            />
            <Box flex="1" px="16">
              <Card.Body>
                <Card.Title mb="2" textStyle="3xl" fontFamily="Space Grotesk">
                  Log in to
                  <Text color="teal.solid" letterSpacing="wider">
                    Portfoli-O-matic
                  </Text>
                </Card.Title>
                <HStack marginTop="10">
                  <InputGroup startElement={<LuMail />}>
                    <Input
                      placeholder="Email"
                      variant="outline"
                      borderWidth="2px"
                      rounded="lg"
                      minW="300px"
                      borderColor="teal.800"
                      _focus={{ borderColor: "teal.600" , outline: "none"}}
                    />
                  </InputGroup>
                </HStack>
                <HStack marginTop="5">
                  <InputGroup startElement={<LuLock />}>
                    <PasswordInput
                      placeholder="Password"
                      variant="outline"
                      rounded="lg"
                      borderWidth="2px"
                      minW="300px"
                      borderColor="teal.800"
                      _focus={{ borderColor: "teal.600" , outline: "none"}}
                    />
                  </InputGroup>
                </HStack>
                <HStack marginTop="5">
                  <Text color="teal" textStyle="sm" textDecoration="underline">
                    Forgot your password?
                  </Text>
                </HStack>
              </Card.Body>
              <Card.Footer className="flex justify-center w-full">
                <VStack className="w-full">
                  <Button
                    marginTop="5"
                    colorPalette="teal"
                    variant="solid"
                    rounded="xl"
                    width="75%"
                  >
                    Log In
                  </Button>
                  <Box
                    marginTop="5"
                    bg="blue.300"
                    rounded="xl"
                    p="3"
                    opacity="50%"
                  >
                    <HStack>
                      <Icon size="lg" color="tomato">
                        <LuShieldAlert></LuShieldAlert>
                      </Icon>
                      <Text width="90%" textStyle="sm" color="gray.700">
                        Never share any of your login details with anyone.
                        Always be aware of phishing attempts when asked for such
                        details.
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              </Card.Footer>
            </Box>
          </Card.Root>
        </Box>
      </VStack>
    </div>
  );
}

export default Login;
