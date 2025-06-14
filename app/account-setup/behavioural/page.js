"use client"
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    Breadcrumb,
    Box,
    AbsoluteCenter,
    createListCollection,
    Stack, 
    StackSeparator,
    Center,
    Button,
    HStack
} from "@chakra-ui/react"
import { RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri"
import DropdownSelector from "@/components/ui/dropdown-selector.jsx"

const Behavioural = () => {
    const router = useRouter();
    const [marketCrash, setMarketCrash] = useState(-1)
    const [choiceOfPortfolio, setChoiceOfPortfolio] = useState(-1)
    const [marketBoom, setMarketBoom] = useState(-1)

    const marketCrashes = createListCollection({
        items: [
            { label: "Panic and sell", value: 1 },
            { label: "Do nothing", value: 2 },
            { label: "Invest more (buy the dip)", value: 3 },
        ],
        })
    
    const choiceOfPortfolios = createListCollection({
        items: [
            { label: "5% average return with 5% possible loss", value: 1 },
            { label: "10% average return with 20% possible loss", value: 2 }
        ],
        })
    
    const marketBooms = createListCollection({
        items: [
            { label: "Sell holdings and Take Profit", value: 1 },
            { label: "Do nothing", value: 2 },
            { label: "Invest more", value: 3 }
        ],
        })
    
    
    return (
        <Box>
            <AbsoluteCenter>
                <Stack separator={<StackSeparator />} width="1000px" gap="10">

                    <Box>
                        <Center>
                            <Breadcrumb.Root>
                                <Breadcrumb.List>
                                    <Breadcrumb.Item>
                                        <Breadcrumb.Link onClick={() => router.push("/account-setup/risk-preference")}>Risk Preference</Breadcrumb.Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Separator />
                                    <Breadcrumb.Item>
                                            <Breadcrumb.Link onClick={() => router.push("/account-setup/background")}>Background</Breadcrumb.Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Separator />
                                    <Breadcrumb.Item>
                                        <Breadcrumb.CurrentLink>Behavioural</Breadcrumb.CurrentLink>
                                    </Breadcrumb.Item>
                                </Breadcrumb.List>
                            </Breadcrumb.Root>
                        </Center>
                    </Box>

                    {/* Market Crash Reaction Question */}
                    <DropdownSelector size="lg" collection={marketCrashes} func={setMarketCrash} 
                    label="What would you do if your portfolio's value dropped by 20%?" placeholder="Select action" value={marketCrash}/>

                    {/* Choosing between hypothetical returns vs risk Question */}
                    <DropdownSelector size="lg" collection={choiceOfPortfolios} func={setChoiceOfPortfolio} 
                    label="In choosing between portfolios, which would you prefer" placeholder="Select portfolio" value={choiceOfPortfolio}/>

                    {/* Market Boom Reaction Question */}
                    <DropdownSelector size="lg" collection={marketBooms} func={setMarketBoom} 
                    label="If your portfolio grew by 30% in a year, what would you do?" placeholder="Select action" value={marketBoom}/>
                    
                    <Box>
                        <HStack
                        justify="space-between"
                        w="100%">
                            <Button colorPalette="blue" variant="outline" onClick={() => router.push("/account-setup/background")}>
                                Back <RiArrowLeftLine />
                            </Button>
                            <Button colorPalette="blue" variant="outline" onClick={() => router.push("/account-setup/behavioural")}>
                                Submit <RiArrowRightLine />
                            </Button>
                        </HStack>
                    </Box>

                </Stack>
            </AbsoluteCenter>
        </Box>
    )
}

export default Behavioural