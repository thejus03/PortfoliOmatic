"use client"
import { useState, useEffect } from 'react'
import {    Stack, 
            Box, 
            Heading, 
            Text,
            Button,
            Card,
            For,
            VStack,
            Spinner,
            HStack,
            SimpleGrid
        } from "@chakra-ui/react"
import { Space_Grotesk } from "next/font/google"
import { useAccountSetup } from '../context/AccountSetupContext'
import Popup from '@/components/ui/portfolio-popup'
import { getPortfolioSuggestions } from '@/app/apis/portfolio'
import { useRouter } from 'next/navigation'

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["600"],
  });


function Page() {
    const { formData } = useAccountSetup();
    const [portfolios, setPortfolios] = useState(null);
    
    const router = useRouter();
    
    const handleContinue = (pid) => {
        router.push(`/trade?pid=${pid}`);
    };
    
    
    useEffect(() => {
        const fetchPortfolio = async () => {
            const totalScore = Object.values(formData)
                .flatMap(Object.values)
                .reduce((sum, val) => sum + val, 0);
            
            const token = localStorage.getItem('token');

            const result = await getPortfolioSuggestions(totalScore, token);
            
            if (result.success) {
                setPortfolios(result.data);
            } else {
                console.error("Error fetching portfolio suggestions");
            }
        };

        fetchPortfolio();
    }, [formData]);

    if (!portfolios) {
        return (
            <VStack colorPalette="teal">
                <Spinner />
                <Text color="blue.200" textStyle="xl">Loading Portfolio Recommedations...</Text>
            </VStack>
        );
    }

    const name_and_description = {
        "ultra_low": {"name": "Capital Preservation Portfolio", 
                      "description": "This portfolio prioritizes minimal risk and steady returns by focusing heavily on government bonds and inflation-protected securities. Ideal for conservative investors or those with short investment horizons."
        },
        "low": {"name": "Conservative Income Portfolio",
                "description": "Designed to provide slightly higher returns than ultra-safe assets while still preserving safety, this portfolio mixes high-quality bonds with a modest allocation to defensive stocks and gold."
        },
        "moderate": {"name": "Balanced Growth Portfolio",
                "description": "Perfect for medium-term investors, this diversified portfolio blends equities, bonds, and alternative assets like gold to achieve stable growth without taking on excessive risk."
        },
        "high": {"name": "Growth-Oriented Portfolio",
                "description": "This portfolio leans heavily on equities, especially from growth sectors, to maximize long-term gains, with a small cushion in fixed-income assets to manage volatility."
        },
        "very_high": {"name": "Aggressive Growth Portfolio",
                "description": "Built for those who can stomach market swings, this aggressive portfolio is packed with high-growth equities and minimal defensive allocation. Big risks, but potentially big rewards."
        }
    }

    const suggestedPortfolio = portfolios.suggested[0]
    const otherPortfolios = portfolios.others

    return (
        <Stack direction="column" align="center" justify="center" gap="5">
            <Box className="mt-10">
                <Heading textStyle="2xl" color="blue.200" fontWeight="bold" fontFamily={spaceGrotesk.style.fontFamily}>Our Recommended Portfolio: </Heading>
            </Box>

            <Card.Root width="600px" height="300px" bg="blue.900">
                <Card.Body gap="2">
                    <Card.Title mt="2" mb="3" fontSize="xl" fontWeight="bold">{name_and_description[suggestedPortfolio.name].name}</Card.Title>
                    <Card.Description fontSize="md">
                    {name_and_description[suggestedPortfolio.name].description}
                    </Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="space-between">
                    <Popup portfolio={suggestedPortfolio} title={name_and_description[suggestedPortfolio.name].name}/>
                    <Button variant="outline" borderWidth="2px" borderColor="white" color="white" px={5} py={2} onClick={() => handleContinue(suggestedPortfolio.id)}>
                        Select
                    </Button>
                </Card.Footer>
            </Card.Root>

            <Box className="mt-5">
                <Heading textStyle="2xl" color="blue.200" fontWeight="bold" fontFamily={spaceGrotesk.style.fontFamily}>Or, select another Portfolio that better suits your needs: </Heading>
            </Box>

            <Box padding="4">
                <SimpleGrid columns={2} gap="40px">
                    <For each={otherPortfolios}>
                        {(otherPortfolio, index) => (
                            <Card.Root height="300px" width="500px" key={index} bg="blue.900" spaceX="8">
                                <Card.Body gap="2">
                                    <Card.Title mt="2" mb="3" fontSize="xl" fontWeight="bold">{name_and_description[otherPortfolio.name].name}</Card.Title>
                                    <Card.Description fontSize="md">
                                    {name_and_description[otherPortfolio.name].description}
                                    </Card.Description>
                                </Card.Body>
                                <Card.Footer justifyContent="space-between">
                                    <Popup portfolio={otherPortfolio} title={name_and_description[otherPortfolio.name].name}/>
                                    <Button variant="outline" borderWidth="2px" borderColor="white" color="white" px={5} py={2} onClick={() => handleContinue(otherPortfolio.id)}>
                                        Select
                                    </Button>
                                </Card.Footer>
                            </Card.Root>
                        )}
                    </For>
                </SimpleGrid>
            </Box>

        </Stack>
    )
}

export default Page