"use client";
import React from "react";
import { useState } from "react";
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
  Icon
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { LuMail, LuLock, LuShieldAlert, LuLogIn } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster"
import { login } from "@/app/apis/auth"
import Navbar from "@/components/Navbar";

function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  const handleLogin = async () => {
    toaster.create({
      title: "Logging in",
      description: "Please wait...",
      type: "info",
      duration: 1000
    }); 

    const result = await login(email, password);
    
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      if (!result.data.profiled) {
        router.push('/account-setup/risk-preference');
      } else {
        router.push('/home');
      }
    } else {
      toaster.create({
        title: "Login failed",
        description: result.error,
        type: "error"
      });
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

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
              maxW="450px"
              src="https://images.unsplash.com/photo-1752606402425-fa8ed3166a91?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="stocks"
            />
            <Box flex="1" px="16">
              <Card.Body>
                <Card.Title textStyle="3xl" className="font-space-grotesk" fontWeight="semibold" color="gray.300/80">
                  Log in to
                  <Text color="blue.500/80" letterSpacing="wider" fontWeight="bold" className="font-space-grotesk">
                    PortfoliOmatic
                  </Text>
                </Card.Title>
                <HStack marginTop="10">
                  <InputGroup startElement={<LuMail />}>
                    <Input
                      placeholder="Email"
                      variant="outline"
                      borderWidth="2px"
                      rounded="lg"
                      className="font-space-grotesk"
                      minW="300px"
                      borderColor="blue.800"
                      color="white"
                      _focus={{ borderColor: "blue.600" , outline: "none"}}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      className="font-space-grotesk"
                      borderColor="blue.800"
                      color="white"
                      onKeyDown={handleEnter}
                      _focus={{ borderColor: "blue.600" , outline: "none"}}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </HStack>
                <HStack marginTop="5">
                  <Text color="blue.400/80" textStyle="sm" textDecoration="underline" cursor="pointer" className="font-space-grotesk">
                    Forgot your password?
                  </Text>
                </HStack>
              </Card.Body>
              <Card.Footer className="flex justify-center w-full">
                <VStack className="w-full">
                  <Button
                    marginTop="5"
                    colorPalette="blue"
                    variant="solid"
                    rounded="full"
                    color="blue.400"
                    fontWeight="bold"
                    fontFamily="Space Grotesk"
                    width="75%"
                    onClick={handleLogin}
                    borderWidth="2px"
                    borderColor="blue.700"
                    bgColor="blue.700/50" px={5} py={2}
                    _hover={{ bgColor: "blue.700",
                      transform: "scale(1.01)"
                    }}
                  >
                    Log In
                    <LuLogIn />
                  </Button>
                  <Box
                    marginTop="10"
                    bg="gray.900/60"
                    backdropFilter="blur(10px)"
                    rounded="3xl"
                    padding="1.5rem"
                    opacity="55%"
                  >
                    <HStack>
                      <Icon size="lg" color="tomato"  fill="tomato" marginRight="3">
                        <LuShieldAlert></LuShieldAlert>
                      </Icon>
                      <Text width="90%" textStyle="xs" color="blue.300" className="font-sans">
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
