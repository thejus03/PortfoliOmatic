"use client"

import { useAccountSetup } from "../context/AccountSetupContext";
import { useRouter } from "next/navigation";
import { 
    Breadcrumb,
    Box,
    Stack, 
    Center,
    Heading,
    CheckboxGroup,
    Text,
    CheckboxCard,
    Flex,
    Checkbox,
    Button,
    Avatar,
    Card
} from "@chakra-ui/react"
import { RiArrowRightCircleLine } from 'react-icons/ri'
import { useState } from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["600"],
  });

function page() {
  const { formData, setFormData } = useAccountSetup();
  const [selectedRisk, setSelectedRisk] = useState(formData.riskPreference.risk);

  const handleRiskChange = (risk) => {
    setSelectedRisk(risk);

  }

  const router = useRouter();

  const savePage = () => {
    setFormData({...formData, riskPreference: {risk: selectedRisk}})
  }

  const handleNext = () => {
    savePage()
      router.push("/account-setup/background");
  }

  const option1 = 0
  const option2 = 7.5
  const option3 = 15
  const option4 = 22.5
  const option5 = 30

  return (
      <Stack direction="column" align="center" justify="center" gap="10">
          <Box className="mt-16">
              <Center>
                  <Breadcrumb.Root size="sm" border="1px solid" borderColor="blue.600" borderRadius="full" padding="2" paddingX="4" backgroundColor="blue.900" opacity={0.75}>
                      <Breadcrumb.List>
                          <Breadcrumb.Item>
                              <Breadcrumb.CurrentLink color="blue.400" fontWeight="bold">Risk Preference</Breadcrumb.CurrentLink>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item>
                              <Breadcrumb.Link onClick={() => {savePage(); router.push("/account-setup/background")}} cursor="pointer">Background</Breadcrumb.Link>
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
                <Heading textStyle="3xl" textAlign="center" color="blue.400" fontWeight="bold" fontFamily={spaceGrotesk.style.fontFamily}>Risk Preference</Heading>
                <Stack>
                    <Heading textStyle="xl" fontWeight="bold" color="blue.200">What best describes your investment risk preference?</Heading>
                    <CheckboxGroup>
                        <Flex gap="4" flexWrap="wrap">
                             <CheckboxCard.Root checked={selectedRisk === option1} onClick={()=>handleRiskChange(option1)} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
                                 <CheckboxCard.HiddenInput />
                                 <CheckboxCard.Control onClick={()=>console.log("clicked")}>
                                     <CheckboxCard.Content color="teal.100">
                                         <CheckboxCard.Label fontWeight="bold" fontSize="xl" paddingX="4">Protective</CheckboxCard.Label>
                                         <CheckboxCard.Description textStyle="md" marginTop="5" paddingX="4">
                                             In order to protect your assets, you prefer to minimise your risk. This results
                                             in minimal or low returns over a long-term investment horizon.
                                         </CheckboxCard.Description>
                                     </CheckboxCard.Content>
                                     <CheckboxCard.Indicator />
                                 </CheckboxCard.Control>
                             </CheckboxCard.Root>
                             <CheckboxCard.Root checked={selectedRisk === option2} onClick={()=>handleRiskChange(option2)} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
                                 <CheckboxCard.HiddenInput />
                                 <CheckboxCard.Control>
                                     <CheckboxCard.Content color="teal.100">
                                         <CheckboxCard.Label fontWeight="bold" fontSize="xl" paddingX="4">Conservative</CheckboxCard.Label>
                                         <CheckboxCard.Description textStyle="md" marginTop="5" paddingX="4">
                                             Your priority is to keep your portfolio balance up with inflation
                                         </CheckboxCard.Description>
                                     </CheckboxCard.Content>
                                     <CheckboxCard.Indicator />
                                 </CheckboxCard.Control>
                             </CheckboxCard.Root>
                             <CheckboxCard.Root defaultChecked checked={selectedRisk === option3} onClick={()=>handleRiskChange(option3)} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
                                 <CheckboxCard.HiddenInput />
                                 <CheckboxCard.Control>
                                     <CheckboxCard.Content color="teal.100">
                                         <CheckboxCard.Label fontWeight="bold" fontSize="xl" paddingX="4">Balanced</CheckboxCard.Label>
                                         <CheckboxCard.Description textStyle="md" marginTop="5" paddingX="4">
                                            With a balanced risk profile, you prefer to take a moderate level of risk 
                                            under normal market conditions to increase your potential medium-to-long-term returns.
                                         </CheckboxCard.Description>
                                     </CheckboxCard.Content>
                                     <CheckboxCard.Indicator />
                                 </CheckboxCard.Control>
                             </CheckboxCard.Root>
                             <CheckboxCard.Root checked={selectedRisk === option4} onClick={()=>handleRiskChange(option4)} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
                                 <CheckboxCard.HiddenInput />
                                 <CheckboxCard.Control>
                                     <CheckboxCard.Content color="teal.100">
                                         <CheckboxCard.Label fontWeight="bold" fontSize="xl" paddingX="4">Growth</CheckboxCard.Label>
                                         <CheckboxCard.Description textStyle="md" marginTop="5" paddingX="4">
                                            You want higher returns and are willing to undertake a relatively high level of risk
                                            under normal market conditions to increase your potential medium-to-long term returns.
                                         </CheckboxCard.Description>
                                     </CheckboxCard.Content>
                                     <CheckboxCard.Indicator />
                                 </CheckboxCard.Control>
                             </CheckboxCard.Root>
                             <CheckboxCard.Root checked={selectedRisk === option5} onClick={()=>handleRiskChange(option5)} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
                                 <CheckboxCard.HiddenInput />
                                 <CheckboxCard.Control>
                                     <CheckboxCard.Content color="teal.100">
                                         <CheckboxCard.Label fontWeight="bold" fontSize="xl" paddingX="4">Agressive</CheckboxCard.Label>
                                         <CheckboxCard.Description textStyle="md" marginTop="5" paddingX="4">
                                            You understand that under both normal and abnormal market conditions, associated risk
                                            can result in significant returns, but can also result in losing large portions of your 
                                            capital.
                                         </CheckboxCard.Description>
                                     </CheckboxCard.Content>
                                     <CheckboxCard.Indicator />
                                 </CheckboxCard.Control>
                             </CheckboxCard.Root>

                         </Flex>
                    </CheckboxGroup>
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
          </Box>
      </Stack>
  )
}

export default page