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
import {
    PasswordInput, PasswordStrengthMeter
  } from "@/components/ui/password-input"
import { LuMail, LuLock, LuShieldAlert, LuMessageCircleWarning  } from "react-icons/lu";
import { Space_Grotesk } from "next/font/google";
import { Highlight } from "@chakra-ui/react"

const Warning = ({ message }) => {
  return (
    <Alert.Root status="error" mt="4" rounded="lg">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Invalid Fields</Alert.Title>
        <Alert.Description>
          {message}
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
});

function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
    all: false,
  });
  
  const handleCreateAccount = () => {
    setShowError(false);
    
    if (email === '') {
      setErrorMessage('Please enter a valid email address.');
      setShowError(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      return 
    }
    
 
    else if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      setShowError(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      return 
    }
    
    // send to backend from creation
    else {

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
            <Button onClick={() => router.push("/login")} colorPalette="blue" variant="ghost" size="md" rounded="lg">
              Log In 
            </Button>
          </div>
        </div>
      </VStack>

      <VStack marginTop="14">
          <Heading textStyle="xl" color="gray.200" fontFamily="Space Grotesk">Join the Future of Investing</Heading>
          <Heading textStyle="3xl" color="gray.200"><Highlight query="Optimised" styles={{ px: "1", bg: "teal.emphasized" }}>Your Portfolio, Optimised by Intelligence</Highlight></Heading>
      </VStack>
      <VStack marginTop="20" maxW="lg" mx="auto" alignItems="center" width="100%">
        <Field.Root required>
          <Field.Label>
            Email <Field.RequiredIndicator />
          </Field.Label>
          <Input placeholder="me@example.com" variant="outline" value={email} onChange={(e) => setEmail(e.target.value)} rounded="lg" borderWidth="2px" minW="300px" borderColor="teal.800"_focus={{ borderColor: "teal.600" , outline: "none"}}/>
        </Field.Root>
        <Field.Root required>
          <Field.Label>
            Password<Field.RequiredIndicator />
          </Field.Label>
          <Stack width="100%">
            <PasswordInput 
              placeholder="Choose a password" 
              variant="outline"  
              rounded="lg" 
              borderWidth="2px" 
              minW="300px" 
              borderColor="teal.800"
              _focus={{ borderColor: "teal.600" , outline: "none"}}
              value={password}
              onChange={(e) => handleCriteria(e.target.value)}
            />
          </Stack>
        </Field.Root>
        <Box 
          bg={criteria.all ? "green.50" : "red.50"} 
          width="80%" 
          rounded="xl" 
          p="4" 
          borderWidth="3px" 
          borderColor={criteria.all? "green.300" : "red.300"} 
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
          <PasswordInput placeholder="Choose a password" variant="outline"  value={confirmPassword}  onChange={(e) => setConfirmPassword(e.target.value)} rounded="lg" borderWidth="2px" minW="300px" borderColor="teal.800"_focus={{ borderColor: "teal.600" , outline: "none"}}/>
        </Field.Root>
        
        {showError && <Warning message={errorMessage} />}
        <Button 
          mt="5" 
          colorPalette="teal" 
          variant="solid" 
          size="md" 
          rounded="lg" 
          width="100%" 
          fontFamily="Space Grotesk"
          onClick={() => handleCreateAccount()}
          disabled={!criteria.all}
        >
          Create Account
        </Button>
      </VStack>
    </div>
  );
}

export default Register;
