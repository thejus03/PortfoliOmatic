"use client"
import React from 'react'
import { useState, useEffect } from 'react'
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
import { toaster } from '@/components/ui/toaster'
import { getFormData, saveFormData } from '@/utils/formStorage'

const Background = () => {
    const router = useRouter();
    const [timeHorizon, setTimeHorizon] = useState(-1)
    const [incomeLevel, setIncomeLevel] = useState(-1)
    const [monthlyExpense, setMonthlyExpenses] = useState(-1)
    const [investmentPercentage, setInvestmentPercentage] = useState(-1)

    useEffect(() => {
        const savedData = getFormData();
        if (savedData.partB) {
        setTimeHorizon(savedData.partB.timeHorizon || -1);
        setIncomeLevel(savedData.partB.incomeLevel || -1);
        setMonthlyExpenses(savedData.partB.monthlyExpense || -1);
        setInvestmentPercentage(savedData.partB.investmentPercentage || -1);
        }
    }, []);

    const timeHorizons = createListCollection({
        items: [
            { label: "Less than 1 year", value: 1 },
            { label: "1 to 3 years", value: 2 },
            { label: "3 to 5 years", value: 3 },
            { label: "5 to 10 years", value: 4 },
            { label: "5 to 10 years", value: 5}
        ],
        })
    
    const incomeLevels = createListCollection({
        items: [
            { label: "Less than $40,000 ", value: 1 },
            { label: "Between $40,000 and $80,000", value: 2 },
            { label: "Between $80,000 and $120,000", value: 3 },
            { label: "Between $120,000 and $200,000", value: 4 },
            { label: "Between $200,000 and $500,000", value: 5}
        ],
        })
    
    const monthlyExpenses = createListCollection({
        items: [
            { label: "Less than 15%", value: 5 },
            { label: "Between 15% and 25%", value: 4 },
            { label: "Between 25% and 35%", value: 3 },
            { label: "Between 35% and 45%", value: 2 },
            { label: "More than 45%", value: 1}
        ],
        })
    
    const investmentPercentages = createListCollection({
        items: [
            { label: "Less than 15%", value: 1 },
            { label: "Between 15% and 25%", value: 2 },
            { label: "Between 25% and 35%", value: 3 },
            { label: "Between 35% and 45%", value: 4 },
            { label: "More than 45%", value: 5}
        ],
        })
    
    const handleNext = () => {
        if (timeHorizon == -1 || incomeLevel == -1 || monthlyExpense == -1 || investmentPercentage == -1) {
            toaster.error({
                    title: "Incomplete form",
                    description: "Please fill in all fields."
                  });
        } else {
            saveFormData("partB", {timeHorizon: timeHorizon, incomeLevel: incomeLevel, monthlyExpense: monthlyExpense, investmentPercentage: investmentPercentage})
            router.push("/account-setup/behavioural")
        }
    }
    
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
                                            <Breadcrumb.CurrentLink>Background</Breadcrumb.CurrentLink>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Separator />
                                    <Breadcrumb.Item>
                                        <Breadcrumb.Link onClick={() => router.push("/account-setup/behavioural")}>Behavioural</Breadcrumb.Link>
                                    </Breadcrumb.Item>
                                </Breadcrumb.List>
                            </Breadcrumb.Root>
                        </Center>
                    </Box>

                    {/* Time Horizon Question*/}
                    <DropdownSelector size="lg" collection={timeHorizons} func={setTimeHorizon} 
                    label="What is your expected investment time horizon" placeholder="Select time horizon" value={timeHorizon} />

                    {/* Income level Question*/}
                    <DropdownSelector size="lg" collection={incomeLevels} func={setIncomeLevel} 
                    label="What is your annual income range?" placeholder="Select annual income range" value={incomeLevel}/>

                    {/* Monthly expenses Question*/}
                    <DropdownSelector size="lg" collection={monthlyExpenses} func={setMonthlyExpenses} 
                    label="What is your monthly expenditure as a percentage of your monthly income?" placeholder="Select monthly expenditure percentage" value={monthlyExpense}/>

                    {/* Investment percentage Question*/}
                    <DropdownSelector size="lg" collection={investmentPercentages} func={setInvestmentPercentage} 
                    label="What percentage of your net liquid assets are your planning to invest?" placeholder="Select investment percentage" value={investmentPercentage}/>
                    
                    <Box>
                        <HStack
                        justify="space-between"
                        w="100%">
                            <Button colorPalette="blue" variant="outline" onClick={() => router.push("/account-setup/risk-preference")}>
                                Back <RiArrowLeftLine />
                            </Button>
                            <Button colorPalette="blue" variant="outline" onClick={handleNext}>
                                Next <RiArrowRightLine />
                            </Button>
                        </HStack>
                    </Box>

                </Stack>
            </AbsoluteCenter>
        </Box>
    )
}

export default Background