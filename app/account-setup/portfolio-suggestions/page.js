"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {    Stack, 
            Box, 
            Heading, 
            Text,
            Button,
            Card,
            Avatar,
            For,
            VStack,
            Spinner,
            HStack
        } from "@chakra-ui/react"
import { Space_Grotesk } from "next/font/google"
import { useAccountSetup } from '../context/AccountSetupContext'
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
                "suggested": {
                    "name": "Moderate Growth Portfolio",
                    "description": "A balanced portfolio with moderate exposure to equities, bonds, and gold.",
                    "assets": {
                    "BND": {
                        "asset_class": "bond",
                        "asset_name": "Vanguard Total Bond Market ETF",
                        "weightage": 0.15318
                    },
                    "IAU": {
                        "asset_class": "gold",
                        "asset_name": "iShares Gold Trust",
                        "weightage": 0.10745
                    },
                    "JNJ": {
                        "asset_class": "equity",
                        "asset_name": "Johnson & Johnson",
                        "weightage": 0.14484
                    },
                    "KO": {
                        "asset_class": "equity",
                        "asset_name": "Coca Cola",
                        "weightage": 0.08699
                    },
                    "MRK": {
                        "asset_class": "equity",
                        "asset_name": "Merck & Co.",
                        "weightage": 0.00055
                    },
                    "NVDA": {
                        "asset_class": "equity",
                        "asset_name": "NVIDIA",
                        "weightage": 0.05918
                    },
                    "PG": {
                        "asset_class": "equity",
                        "asset_name": "Procter & Gamble",
                        "weightage": 0.00374
                    },
                    "TIP": {
                        "asset_class": "bond",
                        "asset_name": "iShares TIPS Bond ETF",
                        "weightage": 0.28446
                    },
                    "WMT": {
                        "asset_class": "equity",
                        "asset_name": "Walmart",
                        "weightage": 0.10544
                    },
                    "XOM": {
                        "asset_class": "equity",
                        "asset_name": "Exxon Mobil",
                        "weightage": 0.05417
                    }
                    }
                },
                "rest": [
                    {
                    "name": "Conservative Income Portfolio",
                    "description": "A lower-risk portfolio focused heavily on bonds and dividend-paying stocks.",
                    "assets": {
                        "BND": {
                        "asset_class": "bond",
                        "asset_name": "Vanguard Total Bond Market ETF",
                        "weightage": 0.35
                        },
                        "TIP": {
                        "asset_class": "bond",
                        "asset_name": "iShares TIPS Bond ETF",
                        "weightage": 0.25
                        },
                        "PG": {
                        "asset_class": "equity",
                        "asset_name": "Procter & Gamble",
                        "weightage": 0.10
                        },
                        "WMT": {
                        "asset_class": "equity",
                        "asset_name": "Walmart",
                        "weightage": 0.08
                        },
                        "IAU": {
                        "asset_class": "gold",
                        "asset_name": "iShares Gold Trust",
                        "weightage": 0.22
                        }
                    }
                    },
                    {
                    "name": "Aggressive Growth Portfolio",
                    "description": "A high-risk, high-return portfolio with strong equity focus and minimal bonds.",
                    "assets": {
                        "NVDA": {
                        "asset_class": "equity",
                        "asset_name": "NVIDIA",
                        "weightage": 0.25
                        },
                        "XOM": {
                        "asset_class": "equity",
                        "asset_name": "Exxon Mobil",
                        "weightage": 0.15
                        },
                        "KO": {
                        "asset_class": "equity",
                        "asset_name": "Coca Cola",
                        "weightage": 0.10
                        },
                        "JNJ": {
                        "asset_class": "equity",
                        "asset_name": "Johnson & Johnson",
                        "weightage": 0.20
                        },
                        "IAU": {
                        "asset_class": "gold",
                        "asset_name": "iShares Gold Trust",
                        "weightage": 0.10
                        },
                        "TIP": {
                        "asset_class": "bond",
                        "asset_name": "iShares TIPS Bond ETF",
                        "weightage": 0.20
                        }
                    }
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
                <Spinner size="xl" />
                <Text color="blue.200" textStyle="3xl">Loading Portfolio Recommedations...</Text>
            </VStack>
        );
    }

    return (
        <Stack direction="column" align="center" justify="center" gap="10">
            <Box className="mt-16">
                <Heading textStyle="2xl" color="blue.200" fontWeight="bold" fontFamily={spaceGrotesk.style.fontFamily}>Our Recommended Portfolio: </Heading>
            </Box>
            <Card.Root width="320px" bg="blue.900" size="lg">
                <Card.Body gap="2">
                    <Card.Title mt="2">{portfolios.suggested.name}</Card.Title>
                    <Card.Description>
                    {portfolios.suggested.description}
                    </Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    <Button variant="outline">View Details</Button>
                    <Button>Select</Button>
                </Card.Footer>
            </Card.Root>
            <Box className="mt-5">
                <Heading textStyle="2xl" color="blue.200" fontWeight="bold" fontFamily={spaceGrotesk.style.fontFamily}>Select another Portfolio that better suits your needs: </Heading>
            </Box>
            <HStack>
                <For each={portfolios.rest}>
                    {(item, index) => (
                        <Card.Root width="320px" key={index} bg="blue.900">
                            <Card.Body gap="2">
                                <Card.Title mt="2">{item.name}</Card.Title>
                                <Card.Description>
                                {item.description}
                                </Card.Description>
                            </Card.Body>
                            <Card.Footer justifyContent="flex-end">
                                <Button variant="outline">View Details</Button>
                                <Button>Select</Button>
                            </Card.Footer>
                        </Card.Root>
                    )}
                </For>
            </HStack>
        </Stack>
    )
}

export default Page