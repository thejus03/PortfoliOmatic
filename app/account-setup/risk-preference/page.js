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
    Button
} from "@chakra-ui/react"
import { useState } from "react";

function page() {
  const { formData, setFormData } = useAccountSetup();
  const [selectedRisk, setSelectedRisk] = useState(formData.riskPreference.risk);

  const handleRiskChange = (risk) => {
    setSelectedRisk(risk);

  }

  const router = useRouter();

  const handleNext = () => {
    setFormData({...formData, riskPreference: {risk: selectedRisk}});
      router.push("/account-setup/background");
  }

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
                              <Breadcrumb.Link onClick={() => router.push("/account-setup/background")} cursor="pointer">Background</Breadcrumb.Link>
                          </Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item>
                              <Breadcrumb.Link onClick={() => router.push("/account-setup/behavioural")} cursor="pointer">Behavioural</Breadcrumb.Link>
                          </Breadcrumb.Item>
                      </Breadcrumb.List>
                  </Breadcrumb.Root>
              </Center>
          </Box>
          <Box width="100%" maxWidth="1000px">
              <Stack direction="column" gap="16">
                <Heading textStyle="3xl" textAlign="center" color="blue.400" fontWeight="bold">Risk Preference</Heading>
                <Stack>
                    <Heading textStyle="xl" fontWeight="bold" color="blue.200">What best describes your investment risk preference?</Heading>
                    <CheckboxGroup>
                        <Flex gap="4" flexWrap="wrap">
                             <CheckboxCard.Root checked={selectedRisk === "protective"} onClick={()=>handleRiskChange("protective")} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
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
                             <CheckboxCard.Root checked={selectedRisk === "conservative"} onClick={()=>handleRiskChange("conservative")} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
                                 <CheckboxCard.HiddenInput />
                                 <CheckboxCard.Control>
                                     <CheckboxCard.Content color="teal.100">
                                         <CheckboxCard.Label fontWeight="bold" fontSize="xl" paddingX="4">Conservative</CheckboxCard.Label>
                                         <CheckboxCard.Description textStyle="md" marginTop="5" paddingX="4">
                                             Your priority is to keep your portfolio balance up with inflation, but not
                                             to increase its real value.
                                         </CheckboxCard.Description>
                                     </CheckboxCard.Content>
                                     <CheckboxCard.Indicator />
                                 </CheckboxCard.Control>
                             </CheckboxCard.Root>
                             <CheckboxCard.Root defaultChecked checked={selectedRisk === "balanced"} onClick={()=>handleRiskChange("balanced")} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
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
                             <CheckboxCard.Root checked={selectedRisk === "growth"} onClick={()=>handleRiskChange("growth")} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
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
                             <CheckboxCard.Root checked={selectedRisk === "aggressive"} onClick={()=>handleRiskChange("aggressive")} variant="outline" colorPalette="teal" minWidth="400px" borderRadius="xl" backgroundColor="teal.900">
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
                        Next
                    </Button>
                </Stack>
              </Stack>
          </Box>
      </Stack>
  )
}

export default page