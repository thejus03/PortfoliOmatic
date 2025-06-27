"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {    Stack, 
            Box, 
            Heading, 
            Text,
            Button,
            Card,
            For,
            VStack,
            Spinner,
            HStack
        } from "@chakra-ui/react"
import { Space_Grotesk } from "next/font/google"
import { useAccountSetup } from '../context/AccountSetupContext'
import Popup from '@/components/ui/portfolio-popup'
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["600"],
  });


function Page() {
    const router = useRouter();
    const { formData } = useAccountSetup();
    const [portfolios, setPortfolios] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
        const totalScore = Object.values(formData)
            .flatMap(Object.values)
            .reduce((sum, val) => sum + val, 0);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/portfolio-suggestion', {
            method: 'POST',
            body: JSON.stringify({ totalScore }),
            headers: {
                'Content-Type': 'application/json',
            },
            });

            if (response.ok) {
            const data = await response.json();
            setPortfolios(data);
            } else {
            throw new Error("API failed");
            }
        } catch (error) {
            console.error("Using fallback mock data due to API failure.");

            const mockData = {
                "suggested": [
                    {
                    "id": 1,
                    "name": "moderate",
                    "tickers_weight": {
                        "BND": {
                        "asset_class": "bond",
                        "asset_name": "Vanguard Total Bond Market ETF",
                        "weightage": 0.35
                        },
                        "IAU": {
                        "asset_class": "gold",
                        "asset_name": "iShares Gold Trust",
                        "weightage": 0.15
                        },
                        "JNJ": {
                        "asset_class": "equity",
                        "asset_name": "Johnson & Johnson",
                        "weightage": 0.5
                        }
                    },
                    "asset_class_weight": {
                        "bond": 0.35,
                        "gold": 0.15,
                        "equity": 0.5,
                        "returns": 0.14,
                        "volatility": 0.07
                    },
                    "created_at": "2025-06-26T15:00:00.000Z"
                    }
                ],
                "others": [
                    {
                    "id": 2,
                    "name": "ultra_low",
                    "tickers_weight": {
                        "SHY": {
                        "asset_class": "bond",
                        "asset_name": "iShares 1-3 Year Treasury Bond ETF",
                        "weightage": 0.7
                        },
                        "TIP": {
                        "asset_class": "bond",
                        "asset_name": "iShares TIPS Bond ETF",
                        "weightage": 0.25
                        },
                        "GLD": {
                        "asset_class": "gold",
                        "asset_name": "SPDR Gold Shares",
                        "weightage": 0.05
                        }
                    },
                    "asset_class_weight": {
                        "bond": 0.95,
                        "gold": 0.05,
                        "returns": 0.02,
                        "volatility": 0
                    },
                    "created_at": "2025-06-25T14:00:00.000Z"
                    },
                    {
                    "id": 3,
                    "name": "high",
                    "tickers_weight": {
                        "AAPL": {
                        "asset_class": "equity",
                        "asset_name": "Apple Inc.",
                        "weightage": 0.45
                        },
                        "MSFT": {
                        "asset_class": "equity",
                        "asset_name": "Microsoft Corporation",
                        "weightage": 0.4
                        },
                        "TLT": {
                        "asset_class": "bond",
                        "asset_name": "iShares 20+ Year Treasury Bond ETF",
                        "weightage": 0.15
                        }
                    },
                    "asset_class_weight": {
                        "equity": 0.85,
                        "bond": 0.15,
                        "returns": 0.40,
                        "volatility": 0.30
                    },
                    "created_at": "2025-06-26T15:30:00.000Z"
                    }
                ]
            }

            setPortfolios(mockData);
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
            <Card.Root width="500px" height="300px" bg="blue.900">
                <Card.Body gap="2">
                    <Card.Title mt="2" mb="3" fontSize="xl" fontWeight="bold">{name_and_description[suggestedPortfolio.name].name}</Card.Title>
                    <Card.Description fontSize="md">
                    {name_and_description[suggestedPortfolio.name].description}
                    </Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="space-between">
                    <Popup portfolio={suggestedPortfolio} title={name_and_description[suggestedPortfolio.name].name}/>
                    <Button variant="outline" borderWidth="2px" borderColor="white" color="white" px={5} py={2}>Select</Button>
                </Card.Footer>
            </Card.Root>
            <Box className="mt-5">
                <Heading textStyle="2xl" color="blue.200" fontWeight="bold" fontFamily={spaceGrotesk.style.fontFamily}>Or, select another Portfolio that better suits your needs: </Heading>
            </Box>
            <HStack>
                <For each={otherPortfolios}>
                    {(otherPortfolio, index) => (
                        <Card.Root width="450px" height="300px" key={index} bg="blue.900">
                            <Card.Body gap="2">
                                <Card.Title mt="2" mb="3" fontSize="xl" fontWeight="bold">{name_and_description[otherPortfolio.name].name}</Card.Title>
                                <Card.Description fontSize="md">
                                {name_and_description[otherPortfolio.name].description}
                                </Card.Description>
                            </Card.Body>
                            <Card.Footer justifyContent="space-between">
                                <Popup portfolio={otherPortfolio} title={name_and_description[otherPortfolio.name].name}/>
                                <Button variant="outline" borderWidth="2px" borderColor="white" color="white" px={5} py={2}>Select</Button>
                            </Card.Footer>
                        </Card.Root>
                    )}
                </For>
            </HStack>
            <Box></Box>
        </Stack>
    )
}

export default Page