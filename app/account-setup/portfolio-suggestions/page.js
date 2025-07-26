"use client"
import { useState, useEffect, useCallback, useMemo } from 'react'
import {    Stack, 
            Box, 
            Heading, 
            Text,
            Button,
            Card,
            For,
            VStack,
            Spinner,
            SimpleGrid,
            Container,
            Flex
        } from "@chakra-ui/react"
import { useAccountSetup } from '../context/AccountSetupContext'
import Popup from '@/components/ui/portfolio-popup'
import { getPortfolioSuggestions } from '@/app/apis/portfolio'
import { name_and_description } from '@/utils/constants'
import { useRouter } from 'next/navigation'

function Page() {
    const { formData } = useAccountSetup();
    const [portfolios, setPortfolios] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    // Memoize the total score to prevent unnecessary recalculations
    const totalScore = useMemo(() => {
        if (!formData || Object.keys(formData).length === 0) return 0;
        return Object.values(formData)
            .flatMap(Object.values)
            .reduce((sum, val) => sum + val, 0);
    }, [formData]);
    
    // Memoized fetch function to prevent unnecessary re-creates
    const fetchPortfolio = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const result = await getPortfolioSuggestions(totalScore, token);
            
            if (result.success) {
                setPortfolios(result.data);
            } else {
                setError(result.error || "Error fetching portfolio suggestions");
            }
        } catch (err) {
            setError("Failed to load portfolio suggestions");
            console.error("Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [totalScore]);
    
    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    if (isLoading) {
        return (
            <Container maxW="1200px" py={8}>
                <VStack spacing={6} py={16} minH="60vh" justify="center">
                    <Box 
                        bg="blue.900/20" 
                        backdropFilter="blur(10px)" 
                        rounded="2xl" 
                        p={8}
                        border="1px solid"
                        borderColor="blue.700/50"
                        shadow="xl"
                    >
                        <VStack spacing={4}>
                            <Spinner size="xl" color="blue.400" thickness="4px" />
                            <Text color="blue.200" textStyle="xl" className="font-space-grotesk" fontWeight="medium">
                                Loading Portfolio Recommendations...
                            </Text>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="1200px" py={8}>
                <VStack spacing={6} py={16} minH="60vh" justify="center">
                    <Box 
                        bg="red.900/20" 
                        backdropFilter="blur(10px)" 
                        rounded="2xl" 
                        p={8}
                        border="1px solid"
                        borderColor="red.700/50"
                        shadow="xl"
                    >
                        <VStack spacing={4}>
                            <Text color="red.300" textStyle="lg" textAlign="center" className="font-space-grotesk">
                                {error}
                            </Text>
                            <Button 
                                data-testid="try-again"
                                onClick={fetchPortfolio}
                                variant="outline"
                                borderWidth="2px"
                                borderColor="blue.600"
                                color="blue.300"
                                rounded="xl"
                                px={8}
                                py={6}
                                _hover={{
                                    bg: "blue.900/50",
                                    borderColor: "blue.500",
                                    transform: "translateY(-2px)",
                                    shadow: "lg"
                                }}
                                transition="all 0.2s"
                            >
                                Try Again
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        );
    }

    if (!portfolios || !portfolios.suggested || portfolios.suggested.length === 0) {
        return (
            <Container maxW="1200px" py={8}>
                <VStack spacing={6} py={16} minH="60vh" justify="center">
                    <Box 
                        bg="blue.900/20" 
                        backdropFilter="blur(10px)" 
                        rounded="2xl" 
                        p={8}
                        border="1px solid"
                        borderColor="blue.700/50"
                        shadow="xl"
                    >
                        <VStack spacing={4}>
                            <Text color="blue.200" textStyle="lg" className="font-space-grotesk">
                                No portfolio suggestions available
                            </Text>
                            <Button 
                                onClick={fetchPortfolio}
                                variant="outline"
                                borderWidth="2px"
                                borderColor="blue.600"
                                color="blue.300"
                                rounded="xl"
                                px={8}
                                py={6}
                                _hover={{
                                    bg: "blue.900/50",
                                    borderColor: "blue.500",
                                    transform: "translateY(-2px)",
                                    shadow: "lg"
                                }}
                                transition="all 0.2s"
                            >
                                Refresh
                            </Button>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        );
    }


    const suggestedPortfolio = portfolios.suggested[0]
    const otherPortfolios = portfolios.others || []

    return (
        <Container maxW="1400px" py={8}>
            <Stack direction="column" align="center" justify="center" gap="12" py={8}>
                {/* Recommended Portfolio Section */}
                <VStack spacing={8}>
                    <Box textAlign="center">
                        <Heading 
                            textStyle="3xl" 
                            color="blue.300" 
                            fontWeight="bold" 
                            className="font-space-grotesk"
                            mb={2}
                        >
                            Our Recommended Portfolio
                        </Heading>
                        <Text color="blue.400/70" textStyle="lg">
                            Based on your risk assessment and preferences
                        </Text>
                    </Box>
                    
                    {/* Suggested Portfolio Card */}
                    <Box
                        bg="gradient-to-br from-blue.900/80 to-blue.800/60"
                        backdropFilter="blur(20px)"
                        rounded="2xl"
                        p={1}
                        shadow="2xl"
                        border="1px solid"
                        borderColor="blue.600/30"
                        position="relative"
                        _before={{
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            rounded: "2xl",
                            bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))",
                            zIndex: -1
                        }}
                    >
                        <Card.Root 
                            width="700px" 
                            minH="350px" 
                            bg="transparent"
                            border="none"
                            shadow="none"
                        >
                            <Card.Body gap="4" p={8}>
                                <Box textAlign="center" mb={4}>
                                    <Text 
                                        fontSize="sm" 
                                        color="blue.400" 
                                        fontWeight="semibold"
                                        textTransform="uppercase"
                                        letterSpacing="wider"
                                        mb={2}
                                    >
                                        Recommended
                                    </Text>
                                    <Card.Title 
                                        fontSize="2xl" 
                                        fontWeight="bold"
                                        color="white"
                                        className="font-space-grotesk"
                                        mb={4}
                                    >
                                        {name_and_description[suggestedPortfolio.name]?.name || 'Portfolio'}
                                    </Card.Title>
                                    <Card.Description 
                                        fontSize="md"
                                        color="blue.100/80"
                                        lineHeight="relaxed"
                                        textAlign="center"
                                    >
                                        {name_and_description[suggestedPortfolio.name]?.description || 'No description available'}
                                    </Card.Description>
                                </Box>
                            </Card.Body>
                            <Card.Footer justifyContent="space-between" p={8} pt={0}>
                                <Popup 
                                    portfolio={suggestedPortfolio} 
                                    title={name_and_description[suggestedPortfolio.name]?.name || 'Portfolio'}
                                />
                                <Button 
                                    variant="solid"
                                    bg="blue.600"
                                    color="white" 
                                    rounded="xl"
                                    px={8}
                                    py={6}
                                    fontWeight="semibold"
                                    fontSize="md"
                                    _hover={{
                                        bg: "blue.500",
                                        transform: "translateY(-2px)",
                                        shadow: "lg"
                                    }}
                                    transition="all 0.2s"
                                    onClick={() => router.push(`/trade?pid=${suggestedPortfolio.id}`)}
                                >
                                    Select Portfolio
                                </Button>
                            </Card.Footer>
                        </Card.Root>
                    </Box>
                </VStack>
                
                {/* Other Portfolios Section */}
                {otherPortfolios.length > 0 && (
                    <VStack spacing={8} width="100%">
                        <Box textAlign="center">
                            <Heading 
                                textStyle="2xl" 
                                color="blue.300" 
                                fontWeight="bold" 
                                className="font-space-grotesk"
                                mb={2}
                            >
                                Alternative Portfolios
                            </Heading>
                            <Text color="blue.400/70" textStyle="md">
                                Explore other options that might better suit your needs
                            </Text>
                        </Box>
                        
                        <Box width="100%" maxW="1200px">
                            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
                                <For each={otherPortfolios}>
                                    {(otherPortfolio, index) => (
                                        <Box
                                            key={`${otherPortfolio.name}-${index}`}
                                            bg="blue.900/40"
                                            backdropFilter="blur(10px)"
                                            rounded="xl"
                                            p={1}
                                            border="1px solid"
                                            borderColor="blue.700/50"
                                            shadow="lg"
                                            transition="all 0.3s"
                                            _hover={{
                                                transform: "translateY(-4px)",
                                                shadow: "xl",
                                                borderColor: "blue.600/70"
                                            }}
                                        >
                                            <Card.Root 
                                                minH="320px" 
                                                bg="transparent"
                                                border="none"
                                                shadow="none"
                                            >
                                                <Card.Body gap="3" p={6}>
                                                    <Card.Title 
                                                        fontSize="xl" 
                                                        fontWeight="bold"
                                                        color="white"
                                                        className="font-space-grotesk"
                                                        mb={3}
                                                    >
                                                        {name_and_description[otherPortfolio.name]?.name || 'Portfolio'}
                                                    </Card.Title>
                                                    <Card.Description 
                                                        fontSize="sm"
                                                        color="blue.200/80"
                                                        lineHeight="relaxed"
                                                    >
                                                        {name_and_description[otherPortfolio.name]?.description || 'No description available'}
                                                    </Card.Description>
                                                </Card.Body>
                                                <Card.Footer justifyContent="space-between" p={6} pt={0}>
                                                    <Popup 
                                                        portfolio={otherPortfolio} 
                                                        title={name_and_description[otherPortfolio.name]?.name || 'Portfolio'}
                                                    />
                                                    <Button 
                                                        variant="outline" 
                                                        borderWidth="2px" 
                                                        borderColor="blue.500/60" 
                                                        color="blue.300" 
                                                        rounded="lg"
                                                        px={6}
                                                        py={4}
                                                        fontSize="sm"
                                                        fontWeight="medium"
                                                        _hover={{
                                                            bg: "blue.700/30",
                                                            borderColor: "blue.400",
                                                            color: "white"
                                                        }}
                                                        transition="all 0.2s"
                                                        onClick={() => router.push(`/trade?pid=${otherPortfolio.id}`)}
                                                    >
                                                        Select
                                                    </Button>
                                                </Card.Footer>
                                            </Card.Root>
                                        </Box>
                                    )}
                                </For>
                            </SimpleGrid>
                        </Box>
                    </VStack>
                )}
            </Stack>
        </Container>
    )
}

export default Page