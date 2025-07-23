"use client"
import { 
    VStack, 
    Box, 
    Button, 
    Text, 
    SimpleGrid, 
    For,
    HStack, 
    RadioCard, 
    InputGroup, 
    NumberInput, 
    Tabs, 
    Flex, 
    CloseButton, 
    Dialog,
    Drawer,
    Portal,
    Card
} from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import { LuDollarSign } from "react-icons/lu";
import Popup from "@/components/ui/portfolio-popup";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export default function Trade({tradePortfolioId, setTradePortfolioId, allPortfolios, name_and_description, portfoliosValue, portfolioIdToName,
                              open, setOpen, tradeAmount, setTradeAmount, typeOfTrade, upperBound, handleTrade, liquidatePortfolio, setLiquidatePortfolio}) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" padding="5" width="95%" border="1px solid" borderColor="red.400" justifySelf="center" maxWidth="1500px">

            <Box display="flex" flexWrap="wrap">
                <For each={allPortfolios}>
                    {(portfolio, index) => (
                            <Card></Card>
                    )}
                </For>
            </Box>
            

            {open && (
                <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="sm">
                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Header>
                                <Drawer.Title>
                                    <Text
                                        fontSize="2xl" 
                                        color="white" 
                                        mb={6}
                                    >
                                        Order Ticket
                                    </Text>
                                </Drawer.Title>
                            </Drawer.Header>

                            <Drawer.Body>
                                <Flex
                                height="100%"
                                width="100%"
                                align="center"
                                justify="center"
                                flexDirection="column"
                                >
                                    <VStack gap={10}>
                                        <Text fontSize="xl">Enter a amount to {typeOfTrade.toLowerCase()}</Text>

                                        <NumberInput.Root 
                                        value={tradeAmount} 
                                        onValueChange={(e) => setTradeAmount(e.value)} 
                                        width="250px" 
                                        height="50px"
                                        borderWidth="3px" 
                                        borderColor="white"
                                        color="white"
                                        borderRadius="lg"
                                        >
                                            <NumberInput.Control />
                                            <InputGroup startElement={<LuDollarSign color="white" />}>
                                                <NumberInput.Input />
                                            </InputGroup>
                                        </NumberInput.Root>

                                        <Text fontSize="xl">
                                            You are going to {typeOfTrade.toLowerCase()} the
                                            <Text color="blue.100">{portfolioIdToName[tradePortfolioId]}</Text>
                                        </Text>

                                        <Text fontSize="xl">
                                            You currently hold $
                                                {portfoliosValue[allPortfolios[allPortfolios.length - 1].id.toString()]
                                                    ? Math.floor(portfoliosValue[allPortfolios[allPortfolios.length - 1].id.toString()] * 100) / 100
                                                    : 0} of this portfolio
                                        </Text>

                                        
                                    </VStack>
                                </Flex>
                            </Drawer.Body>
                            
                            <Drawer.Footer>
                                <Button 
                                borderWidth="3px"
                                color="white" 
                                borderColor="white" 
                                height="50px"
                                px={6} 
                                py={5} 
                                fontSize="xs" 
                                fontWeight="semibold"
                                borderRadius="lg"
                                _hover={{ bg: "red.800" }}
                                onClick={() => setOpen(false)}
                                >
                                Cancel
                                </Button>
                                <Dialog.Root>
                                        <Dialog.Trigger asChild>
                                            <Button 
                                            borderWidth="3px"
                                            color="white" 
                                            borderColor="white" 
                                            height="50px"
                                            px={6} 
                                            py={5} 
                                            fontSize="sm" 
                                            fontWeight="semibold"
                                            borderRadius="lg"
                                            _hover={{ bg: "blue.800" }}
                                            onClick={() => {setLiquidatePortfolio(false); console.log(liquidatePortfolio)}}
                                            >
                                            {typeOfTrade}
                                            </Button>
                                        </Dialog.Trigger>
                                        <Dialog.Trigger asChild>
                                            {typeOfTrade == "Sell" ? 
                                                (<Button 
                                                borderWidth="3px"
                                                color="white" 
                                                borderColor="white" 
                                                height="50px"
                                                px={6} 
                                                py={5} 
                                                fontSize="sm" 
                                                fontWeight="semibold"
                                                borderRadius="lg"
                                                _hover={{ bg: "red.800" }}
                                                onClick={() => {setLiquidatePortfolio(true); console.log(liquidatePortfolio)}}
                                                >
                                                    Liquidate Entire Portfolio
                                                </Button>)
                                                : (<Button></Button>)
                                            }
                                        </Dialog.Trigger>
                                        <Portal>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                            <Dialog.Content>
                                                <Dialog.Header>
                                                <Dialog.Title fontSize="xl" color="grey.900">{typeOfTrade} Order Confirmation</Dialog.Title>
                                                </Dialog.Header>
                                                <Dialog.Body>
                                                <Box>
                                                    {(Number(tradeAmount) > 0 && Number(tradeAmount) < Number(upperBound)) ? (
                                                        <Text fontSize="md">
                                                        You are going to {typeOfTrade.toLowerCase()} 
                                                        <Text as="span" color="blue.100"> ${tradeAmount} </Text>
                                                        worth of the 
                                                        <Text color="blue.100"> {portfolioIdToName[tradePortfolioId]} </Text>
                                                        </Text>
                                                    ) : (!liquidatePortfolio) ? (
                                                        <Text fontSize="md">Invalid {typeOfTrade} amount</Text>)
                                                    : (<Text fontSize="md">You are going to sell off your entire Portfolio</Text>)
                                                    }
                                                </Box>

                                                </Dialog.Body>
                                                <Dialog.Footer>
                                                    <Dialog.ActionTrigger asChild>
                                                        <Button 
                                                        borderWidth="1px"
                                                        color="white" 
                                                        borderColor="white" 
                                                        height="20px"
                                                        px={6} 
                                                        py={5} 
                                                        fontSize="md"
                                                        borderRadius="md"
                                                        _hover={{ bg: "red.800" }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Dialog.ActionTrigger>
                                                    {((tradeAmount > 0 && tradeAmount < upperBound) || liquidatePortfolio) &&
                                                        (<Dialog.ActionTrigger asChild>
                                                            <Button 
                                                            borderWidth="1px"
                                                            color="white" 
                                                            borderColor="white" 
                                                            height="20px"
                                                            px={6} 
                                                            py={5} 
                                                            fontSize="md"
                                                            borderRadius="md"
                                                            _hover={{ bg: "green.800" }}
                                                            onClick={() => {handleTrade(); setOpen(false)}}
                                                            >
                                                                Confirm
                                                            </Button>
                                                        </Dialog.ActionTrigger>)
                                                    }
                                                </Dialog.Footer>
                                                <Dialog.CloseTrigger asChild>
                                                <CloseButton size="sm" />
                                                </Dialog.CloseTrigger>
                                            </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Portal>
                                        </Dialog.Root>
                            </Drawer.Footer>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>
            )}
        </Box>
    )
}