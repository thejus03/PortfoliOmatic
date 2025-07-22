'use client'
import React from "react";
import { useState } from "react";
import {
    Button,
    Box,
    VStack,
    Input, 
    InputGroup,
    Heading,
    Field,
    HStack, 
    Stack,
    Icon,
    Alert
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuMail, LuLock, LuArrowRight } from "react-icons/lu";
import {
    PasswordInput, PasswordStrengthMeter
  } from "@/components/ui/password-input"
import { LuShieldAlert } from "react-icons/lu";
import { Highlight } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import { register } from "@/app/apis/auth";
import Navbar from "@/components/Navbar";

function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
    all: false,
  });

  const handleCreateAccount = async () => {
    
    if (email === '') {
      toaster.error({
        title: "Invalid Email",
        description: "Please enter a valid email address."
      });
      setEmail('');
      handleCriteria('');
      setConfirmPassword('');
      return 
    }
    
 
    else if (password !== confirmPassword) {
      toaster.error({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again."
      });
      handleCriteria('');
      setConfirmPassword('');
      return 
    }
    
    // send to backend from creation
    else {
      toaster.create({
        title: "Creating Account",
        description: "Please wait...",
        type: "info",
        duration: 1000
      });

      const result = await register(email, password);
      
      if (result.success) {
        if (result.data.token) {
          localStorage.setItem('token', result.data.token);
        }
        
        toaster.create({
          title: "Success!",
          description: "Account created successfully. Redirecting to home page...",
          type: "success"
        });
        
        setTimeout(() => {
          router.push('/account-setup/risk-preference');
        }, 1500);
      } else {
        toaster.error({
          title: "Registration Failed",
          description: result.error 
        });
        setEmail('');
        handleCriteria('');
        setConfirmPassword('');
      }
    }
  }

  const handleCriteria = (password) => {
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    const newCriteria = {
      length: hasLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      numbers: hasNumbers,
      special: hasSpecial,
      all: hasLength && hasUppercase && hasLowercase && hasNumbers && hasSpecial
    };

    setPassword(password);
    setCriteria(newCriteria);
      
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

      <VStack marginTop="14" textAlign="center">
          <Heading textStyle="sm" color="blue.300" fontFamily="Space Grotesk" letterSpacing="wider" fontWeight="medium">INTELLIGENT INVESTING</Heading>
                     <Heading textStyle="4xl" color="white" fontFamily="Space Grotesk" fontWeight="bold">
             Build Wealth Smarter with <Highlight query="Algorithm-Driven" styles={{ px: "2", py: "0.5", bg: "blue.emphasized", borderRadius: "md" }}>Algorithm-Driven</Highlight> Portfolios
           </Heading>
          <Heading textStyle="md" color="gray.300" fontWeight="normal" maxW="2xl" marginTop="4">
            Join thousands of smart investors growing their wealth with personalised, algorithm-driven portfolio management
          </Heading>
      </VStack>
      <VStack marginTop="12" maxW="lg" mx="auto" alignItems="center" width="100%" className="font-space-grotesk">
        <Field.Root required>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup startElement={<LuMail />}>

            <Input 
              placeholder="me@example.com" 
              variant="outline" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              rounded="lg" 
              borderWidth="2px" 
              minW="300px" 
              borderColor="blue.800" 
              _focus={{ borderColor: "blue.600" , outline: "none"}}
            />
          </InputGroup>


        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Password<Field.RequiredIndicator />
          </Field.Label>
          <InputGroup startElement={<LuLock />}>
            <PasswordInput 
              placeholder="Choose a password" 
              variant="outline"  
              rounded="lg" 
              borderWidth="2px" 
              minW="300px" 
              borderColor="blue.800"
              _focus={{ borderColor: "blue.600" , outline: "none"}}
              value={password}
              onChange={(e) => handleCriteria(e.target.value)}
            />
          </InputGroup>
        </Field.Root>
        <Box 
          bg={criteria.all ? "green.700/50" : "red.800/50"} 
          width="100%" 
          rounded="xl" 
          p="4" 
          borderWidth="1px" 
          borderColor={criteria.all? "green.700" : "red.700"} 
          shadow="sm" 
          padding="5" 
          opacity="0.8" 
          alignSelf="flex-center" 
          mt="5"
        >
          <HStack spacing="4" alignItems="center">
            <Icon 
              as={LuShieldAlert} 
              boxSize="7" 
              color={criteria.all ? "green.500" : "tomato"} 
              mt="1" 
            />
            <VStack align="stretch" spacing="2" width="100%" pl="7">
              <Box color={criteria.length ? "green.600" : "red.600"} fontSize="xs">
                - Password must be at least 8 characters long {criteria.length && "✓"}
              </Box>
              <Box color={criteria.uppercase ? "green.600" : "red.600"} fontSize="xs">
                - Uppercase letters (A-Z) {criteria.uppercase && "✓"}
              </Box>
              <Box color={criteria.lowercase ? "green.600" : "red.600"} fontSize="xs">
                - Lowercase letters (a-z) {criteria.lowercase && "✓"}
              </Box>
              <Box color={criteria.numbers ? "green.600" : "red.600"} fontSize="xs">
                - Numbers (0-9) {criteria.numbers && "✓"}
              </Box>
              <Box color={criteria.special ? "green.600" : "red.600"} fontSize="xs">
                - Special characters (!@#$%^&*) {criteria.special && "✓"}
              </Box>
            </VStack>
          </HStack>
        </Box>
        <Field.Root required marginTop="5"> 
          <Field.Label>
            Confirm Password<Field.RequiredIndicator />
          </Field.Label>
          <InputGroup startElement={<LuLock />}>
            <PasswordInput 
              placeholder="Confirm Password" 
              variant="outline"  
              value={confirmPassword}  
              onChange={(e) => setConfirmPassword(e.target.value)} 
              rounded="lg" 
              borderWidth="2px" 
              minW="300px" borderColor="blue.800" _focus={{ borderColor: "blue.600" , outline: "none"}}/>
          </InputGroup>
        </Field.Root>
        
        <Button 
          mt="16" 
          variant="solid" 
          size="md" 
          rounded="full" 
          width="75%" 
          className="font-space-grotesk"
          onClick={() => handleCreateAccount()}
          _disabled={{
            bgColor: "gray.700/60",
            borderColor: "gray.700",
            color: "gray.400",
            cursor: "not-allowed",
          }}
          disabled={!criteria.all}
          bgColor="blue.700/50"
          color="blue.400"
          borderWidth="2px" 
          borderColor="blue.700"  px={5} py={2}
          _hover={{
            bgColor: "blue.700",
            transform: "scale(1.01)"
          }}
        >
          Create Account
          <LuArrowRight />
        </Button>
      </VStack>
    </div>
  );
}

export default Register;
