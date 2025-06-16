"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Stack,
    Box,
    Center,
    Breadcrumb,
    Heading,
    RadioGroup,
    Button,
} from '@chakra-ui/react'
import { RiArrowLeftCircleLine, RiCheckboxCircleFill } from 'react-icons/ri'
import { useAccountSetup } from '../context/AccountSetupContext'

function page() {
    const router = useRouter()
    const { formData, setFormData } = useAccountSetup()

    const [selectedOption, setSelectedOption] = useState(formData.behavioural.selectedOption)
    const [selectedOption2, setSelectedOption2] = useState(formData.behavioural.selectedOption2)
    const [selectedOption3, setSelectedOption3] = useState(formData.behavioural.selectedOption3)

    const savePage = () => {
        setFormData({...formData, behavioural: {selectedOption, selectedOption2, selectedOption3}})
    }

    const handleNext = () => {
        savePage()
        router.push("/")
    }

    const handleBack = () => {
        savePage()
        router.push("/account-setup/background")
    }

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
                              <Breadcrumb.Link onClick={() => {savePage(); router.push("/account-setup/background")}} cursor="pointer">Background</Breadcrumb.Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item>
                              <Breadcrumb.CurrentLink color="blue.400" fontWeight="bold">Behavioural</Breadcrumb.CurrentLink>
                          </Breadcrumb.Item>
                      </Breadcrumb.List>
                  </Breadcrumb.Root>
              </Center>
          </Box>
          <Box width="100%" maxWidth="1000px">
            <Stack direction="column" gap="16">
                <Heading textStyle="3xl" textAlign="center" color="blue.400" fontWeight="bold">Behavioural</Heading>
                <Stack>
                    <Heading textStyle="xl" fontWeight="bold" color="blue.200">How would you feel if your portfolio dropped 20% in a market crash?</Heading>
                    <RadioGroup.Root 
                        value={selectedOption} 
                        onValueChange={(e)=>setSelectedOption(e.value)} 
                        colorPalette="blue" 
                        variant="subtle"
                        size="lg"
                        margin="4"
                    >

                        <Stack direction="column" gap="6">
                            <RadioGroup.Item key="panic" value="panic">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Panic and sell</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="nothing" value="nothing">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Do nothing</RadioGroup.ItemText>
                            </RadioGroup.Item>  
                            <RadioGroup.Item key="invest" value="invest">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Invest more (buy the dip)</RadioGroup.ItemText>
                            </RadioGroup.Item>  
                        </Stack>
                    </RadioGroup.Root>
                    <Heading textStyle="xl" fontWeight="bold" color="blue.200" marginTop="4">In choosing between two portfolios, which would you prefer?</Heading>
                        <RadioGroup.Root 
                            value={selectedOption2}
                            onValueChange={(e)=>setSelectedOption2(e.value)}
                            colorPalette="blue"
                            variant="subtle"
                            size="lg"
                            margin="4"
                        >
                            <Stack direction="column" gap="6">
                                <RadioGroup.Item key="portfolio1" value="portfolio1">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>5% average return with 5% possible loss</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item key="portfolio2" value="portfolio2">
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator />
                                    <RadioGroup.ItemText>10% average return with 20% possible loss</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </Stack>
                        </RadioGroup.Root>

                    <Heading textStyle="xl" fontWeight="bold" color="blue.200" marginTop="4">Imagine your portfolio grew 30% in a year. What would you do?</Heading>
                    <RadioGroup.Root
                        value={selectedOption3}
                        onValueChange={(e)=>setSelectedOption3(e.value)}
                        colorPalette="blue"
                        variant="subtle"
                        size="lg"
                        margin="4"
                    >
                        <Stack direction="column" gap="6">
                            <RadioGroup.Item key="take-profit" value="take-profit">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Take profit</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="reinvest" value="reinvest">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Reinvest everything</RadioGroup.ItemText>
                            </RadioGroup.Item>
                            <RadioGroup.Item key="increase" value="increase">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>Increase contributions</RadioGroup.ItemText>
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
                            Submit <RiCheckboxCircleFill />
                        </Button>

                    </Stack>
                </Stack>    
            </Stack>
          </Box>
    </Stack>
  )
}

export default page