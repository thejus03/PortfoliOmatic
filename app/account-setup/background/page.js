"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Stack,
    Box,
    Center,
    Breadcrumb,
    Heading,
    Button,
    createListCollection,
    RadioGroup
} from '@chakra-ui/react'
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from 'react-icons/ri'
import { useAccountSetup } from '../context/AccountSetupContext'

function page() {
    const router = useRouter()
    const { formData, setFormData } = useAccountSetup()

    const [timeHorizon, setTimeHorizon] = useState(formData.background.timeHorizon)
    const [incomeLevel, setIncomeLevel] = useState(formData.background.incomeLevel)
    const [monthlyExpense, setMonthlyExpense] = useState(formData.background.monthlyExpense)
    const [investmentPercentage, setInvestmentPercentage] = useState(formData.background.investmentPercentage)

    const savePage = () => {
        setFormData({...formData, background: {timeHorizon, incomeLevel, monthlyExpense, investmentPercentage}})
    }

    const handleNext = () => {
        savePage()
        router.push("/account-setup/behavioural")
    }

    const handleBack = () => {
        savePage()
        router.push("/account-setup/risk-preference")
    }

    const option1 = 0
    const option2 = 2.5
    const option3 = 5
    const option4 = 7.5
    const option5 = 10

  return (
    <Stack direction="column" align="center" justify="center" gap="10">
        <Box className="mt-16">
              <Center>
                  <Breadcrumb.Root size="sm" border="1px solid" borderColor="blue.600" borderRadius="full" padding="2" paddingX="4" backgroundColor="blue.900" opacity={0.75}>
                      <Breadcrumb.List>
                          <Breadcrumb.Item>
                              <Breadcrumb.Link onClick={() => {savePage(); router.push("/account-setup/risk-preference")}} cursor="pointer">Risk Preference</Breadcrumb.Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item>
                              <Breadcrumb.CurrentLink color="blue.400" fontWeight="bold">Background</Breadcrumb.CurrentLink>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item>
                              <Breadcrumb.Link onClick={() => {savePage(); router.push("/account-setup/behavioural")}} cursor="pointer">Behavioural</Breadcrumb.Link>
                          </Breadcrumb.Item>
                      </Breadcrumb.List>
                  </Breadcrumb.Root>
              </Center>
          </Box>
          <Box width="100%" maxWidth="1000px">
            <Stack direction="column" gap="16">
                <Heading textStyle="3xl" textAlign="center" color="blue.400" fontWeight="bold" className="font-space-grotesk">Background</Heading>
                <Stack>

                    <Heading textStyle="xl" fontWeight="bold" color="blue.200">What is your expected investment time horizon?</Heading>
                    <RadioGroup.Root 
                        value={timeHorizon} 
                        onValueChange={(e)=>setTimeHorizon(e.value)} 
                        colorPalette="blue" 
                        variant="subtle"
                        size="lg"
                        margin="4"
                    >

                        <Stack direction="column" gap="6">
                            <RadioGroup.Item key="less-than-1-year" value={option1}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Less than 1 year</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="1-to-3-years" value={option2}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>1 to 3 years</RadioGroup.ItemText>
                            </RadioGroup.Item>  
                            <RadioGroup.Item key="3-to-5-years" value={option3}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>3 to 5 years</RadioGroup.ItemText>
                            </RadioGroup.Item> 
                            <RadioGroup.Item key="5-to-10-years" value={option4}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>5 to 10 years</RadioGroup.ItemText>
                            </RadioGroup.Item> 
                            <RadioGroup.Item key="more-than-10-years" value={option5}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>more than 10 years</RadioGroup.ItemText>
                            </RadioGroup.Item>  
                        </Stack>
                    </RadioGroup.Root>

                    <Heading textStyle="xl" fontWeight="bold" color="blue.200" marginTop="4">What is your annual income range?</Heading>
                        <RadioGroup.Root 
                            value={incomeLevel}
                            onValueChange={(e)=>setIncomeLevel(e.value)}
                            colorPalette="blue"
                            variant="subtle"
                            size="lg"
                            margin="4"
                        >
                            <Stack direction="column" gap="6">
                                <RadioGroup.Item key="less-than-40000" value={option1}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>Less than $40,000</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item key="40000-to-80000" value={option2}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>$40,000 to $80,000</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item key="80000-to-1200000" value={option3}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>$80,000 to $120,000</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item key="1200000-to-200000" value={option4}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>$120,000 to $200,000</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item key="more-than-200000" value={option5}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>more than $200,000</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </Stack>
                        </RadioGroup.Root>

                    <Heading textStyle="xl" fontWeight="bold" color="blue.200" marginTop="4">What is your monthly expenditure as a percentage of your monthly income?</Heading>
                    <RadioGroup.Root
                        value={monthlyExpense}
                        onValueChange={(e)=>setMonthlyExpense(e.value)}
                        colorPalette="blue"
                        variant="subtle"
                        size="lg"
                        margin="4"
                    >
                        <Stack direction="column" gap="6">
                            <RadioGroup.Item key="less-than-15" value={option1}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>More than 85%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="between-15-to-25" value={option2}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Between 75% to 85%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="between-25-to-35" value={option3}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Between 65% to 75%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="between-35-to-45" value={option4}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Between 55% to 65%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="more-than-45" value={option5}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Less than 55%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                        </Stack>
                    </RadioGroup.Root>

                    <Heading textStyle="xl" fontWeight="bold" color="blue.200" marginTop="4">What percentage of your net liquid assets are your planning to invest?</Heading>
                    <RadioGroup.Root
                        value={investmentPercentage}
                        onValueChange={(e)=>setInvestmentPercentage(e.value)}
                        colorPalette="blue"
                        variant="subtle"
                        size="lg"
                        margin="4"
                    >
                        <Stack direction="column" gap="6">
                            <RadioGroup.Item key="less-than-15" value={option1}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Less than 15%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="between-15-to-25" value={option2}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Between 15% to 25%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="between-25-to-35" value={option3}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Between 25% to 35%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="between-35-to-45" value={option4}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Between 35% to 45%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="more-than-45" value={option5}>
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>More than 45%</RadioGroup.ItemText>
                            </RadioGroup.Item>
                        </Stack>
                    </RadioGroup.Root>

                    <Stack direction="row" justify="space-between">
                        <Button 
                            onClick={handleBack} 
                            borderRadius="lg" 
                            width="300px" 
                            border="1px solid"
                            borderColor="teal.700"
                            color="teal.400" 
                            fontWeight="bold" 
                            variant="outline"
                            _hover={{backgroundColor: "teal.900", color: "teal.400", opacity: 0.7}}
                            alignSelf="flex-end" 
                            marginY="10">
                            <RiArrowLeftCircleLine /> Back
                        </Button>

                        <Button 
                            onClick={handleNext} 
                            borderRadius="lg" 
                            width="300px" 
                            border="1px solid"
                            borderColor="blue.700"
                            color="blue.400" 
                            fontWeight="bold" 
                            variant="outline"
                            _hover={{backgroundColor: "blue.900", color: "blue.400", opacity: 0.7}}
                            alignSelf="flex-end" 
                            marginY="10">
                            Next <RiArrowRightCircleLine />
                        </Button>

                    </Stack>
                </Stack>    
            </Stack>
          </Box>
    </Stack>
  )
}

export default page