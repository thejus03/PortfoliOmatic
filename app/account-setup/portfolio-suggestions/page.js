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
            SimpleGrid
        } from "@chakra-ui/react"
import { useAccountSetup } from '../context/AccountSetupContext'
import Popup from '@/components/ui/portfolio-popup'
import { getPortfolioSuggestions } from '@/app/apis/portfolio'

function Page() {
    const { formData } = useAccountSetup();
    const [portfolios, setPortfolios] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Memoize the total score to prevent unnecessary recalculations
    const totalScore = useMemo(() => {
        if (!formData || Object.keys(formData).length === 0) return 0;
        return Object.values(formData)
            .flatMap(Object.values)
            .reduce((sum, val) => sum + val, 0);
    }, [formData]);
    
    // Memoized fetch function to prevent unnecessary re-creates
    const fetchPortfolio = useCallback(async () => {
        if (totalScore === 0) return;
        
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

    // Show loading only when actively loading
    if (isLoading) {
        return (
            <VStack colorPalette="teal" spacing={4} py={8} minH="50vh" justify="center">
                <Spinner size="xl" color="blue.400" />
                <Text color="blue.200" textStyle="xl">Loading Portfolio Recommendations...</Text>
            </VStack>
        );
    }

    // Show error state
    if (error) {
        return (
            <VStack spacing={4} py={8} minH="50vh" justify="center">
                <Text color="red.400" textStyle="lg" textAlign="center">{error}</Text>
                <Button 
                    onClick={fetchPortfolio}
                    colorPalette="blue"
                    variant="outline"
                >
                    Try Again
                </Button>
            </VStack>
        );
    }

    // Show message if no portfolios available
    if (!portfolios || !portfolios.suggested || portfolios.suggested.length === 0) {
        return (
            <VStack spacing={4} py={8} minH="50vh" justify="center">
                <Text color="blue.200" textStyle="lg">No portfolio suggestions available</Text>
                <Button 
                    onClick={fetchPortfolio}
                    colorPalette="blue"
                    variant="outline"
                >
                    Refresh
                </Button>
            </VStack>
        );
    }

    const name_and_description = {
        "ultra_low": {
            "name": "Capital Preservation Portfolio", 
            "description": "This portfolio prioritizes minimal risk and steady returns by focusing heavily on government bonds and inflation-protected securities. Ideal for conservative investors or those with short investment horizons."
        },
        "low": {
            "name": "Conservative Income Portfolio",
            "description": "Designed to provide slightly higher returns than ultra-safe assets while still preserving safety, this portfolio mixes high-quality bonds with a modest allocation to defensive stocks and gold."
        },
        "moderate": {
            "name": "Balanced Growth Portfolio",
            "description": "Perfect for medium-term investors, this diversified portfolio blends equities, bonds, and alternative assets like gold to achieve stable growth without taking on excessive risk."
        },
        "high": {
            "name": "Growth-Oriented Portfolio",
            "description": "This portfolio leans heavily on equities, especially from growth sectors, to maximize long-term gains, with a small cushion in fixed-income assets to manage volatility."
        },
        "very_high": {
            "name": "Aggressive Growth Portfolio",
            "description": "Built for those who can stomach market swings, this aggressive portfolio is packed with high-growth equities and minimal defensive allocation. Big risks, but potentially big rewards."
        }
    }

    const suggestedPortfolio = portfolios.suggested[0]
    const otherPortfolios = portfolios.others || []

    return (
        <Stack direction="column" align="center" justify="center" gap="5" py={8}>
            <Box className="mt-10">
                <Heading textStyle="2xl" color="blue.200" fontWeight="bold" className="font-space-grotesk">
                    Our Recommended Portfolio:
                </Heading>
            </Box>
            
            {/* Suggested Portfolio */}
            <Card.Root width="600px" height="300px" bg="blue.900">
                <Card.Body gap="2">
                    <Card.Title mt="2" mb="3" fontSize="xl" fontWeight="bold">
                        {name_and_description[suggestedPortfolio.name]?.name || 'Portfolio'}
                    </Card.Title>
                    <Card.Description fontSize="md">
                        {name_and_description[suggestedPortfolio.name]?.description || 'No description available'}
                    </Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="space-between">
                    <Popup 
                        portfolio={suggestedPortfolio} 
                        title={name_and_description[suggestedPortfolio.name]?.name || 'Portfolio'}
                    />
                    <Button 
                        variant="outline" 
                        borderWidth="2px" 
                        borderColor="white" 
                        color="white" 
                        px={5} 
                        py={2}
                    >
                        Select
                    </Button>
                </Card.Footer>
            </Card.Root>
            
            {/* Other Portfolios */}
            {otherPortfolios.length > 0 && (
                <>
                    <Box className="mt-5">
                        <Heading textStyle="2xl" color="blue.200" fontWeight="bold" className="font-space-grotesk">
                            Or, select another Portfolio that better suits your needs:
                        </Heading>
                    </Box>
                    <Box padding="4">
                        <SimpleGrid columns={2} gap="40px">
                            <For each={otherPortfolios}>
                                {(otherPortfolio, index) => (
                                    <Card.Root height="300px" width="500px" key={`${otherPortfolio.name}-${index}`} bg="blue.900">
                                        <Card.Body gap="2">
                                            <Card.Title mt="2" mb="3" fontSize="xl" fontWeight="bold">
                                                {name_and_description[otherPortfolio.name]?.name || 'Portfolio'}
                                            </Card.Title>
                                            <Card.Description fontSize="md">
                                                {name_and_description[otherPortfolio.name]?.description || 'No description available'}
                                            </Card.Description>
                                        </Card.Body>
                                        <Card.Footer justifyContent="space-between">
                                            <Popup 
                                                portfolio={otherPortfolio} 
                                                title={name_and_description[otherPortfolio.name]?.name || 'Portfolio'}
                                            />
                                            <Button 
                                                variant="outline" 
                                                borderWidth="2px" 
                                                borderColor="white" 
                                                color="white" 
                                                px={5} 
                                                py={2}
                                            >
                                                Select
                                            </Button>
                                        </Card.Footer>
                                    </Card.Root>
                                )}
                            </For>
                        </SimpleGrid>
                    </Box>
                </>
            )}
        </Stack>
    )
}

export default Page