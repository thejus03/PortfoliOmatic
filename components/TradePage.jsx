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
    Card,
    Tag
} from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import { LuDollarSign, LuBadgeDollarSign } from "react-icons/lu";
import { name_and_description } from "@/utils/constants";
import Popup from "@/components/ui/portfolio-popup";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export default function Trade({tradePortfolioId, setTradePortfolioId, allPortfolios, portfoliosValue, portfolioIdToName,
                              open, setOpen, tradeAmount, setTradeAmount, typeOfTrade, upperBound, handleTrade, liquidatePortfolio, setLiquidatePortfolio}) {
    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            padding="5" 
            width="95%" 
            justifySelf="center" 
            maxWidth="1500px"
            mb={11}
        >

            <Box display="flex" flexWrap="wrap" gap={4} justifyContent="center" >
                <For each={allPortfolios}>
                    {(portfolio, index) => (
                        <Card.Root 
                            size="lg" 
                            key={index} 
                            width="500px" 
                            borderRadius="xl"
                            bgColor="blue.900/40" 
                            backdropFilter="blur(10px)"
                            border="1px solid" 
                            borderColor="blue.800"
                            
                        >
                            {/* // portfolio.asset_class_weight.volatility */}
                            <Card.Body gap="2">
                            <Card.Title mt="2" fontSize="2xl" className="font-sans" color="blue.200" fontWeight="bold">{name_and_description[portfolio.name].name}</Card.Title>
                            <Tag.Root 
                                size="md" 
                                variant="subtle"
                                colorPalette="gray"
                                className="font-sans tracking-wide"
                                borderColor="teal.700"
                                bgColor="teal.800/60"
                                backdropFilter="blur(10px)"
                                borderRadius="md"
                                paddingX="0.5rem"
                                width="fit-content"
                            >
                                <Tag.Label color="teal.100" fontSize="xs" fontWeight="medium">
                                    {portfolio.name.charAt(0).toUpperCase() + portfolio.name.slice(1).replace('_', ' ')}
                                </Tag.Label>
                            </Tag.Root>
                            <Card.Description className="font-sans mt-3" color="gray.400">
                                {name_and_description[portfolio.name].description}
                            </Card.Description>
                            {/* portfoliosValue[portfolio.id.toString()] */}
                            {portfoliosValue[portfolio.id.toString()] > 0 && (
                                <Box 
                                    fontSize="sm"
                                    color="green.600"
                                    fontWeight="semibold"
                                    fontFamily="mono"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    bgColor="green.800/50"
                                    width="fit-content"
                                    padding="0.25rem 0.5rem"
                                    borderRadius="md"
                                >
                                    <LuDollarSign color="green.400" size={15} />
                                    {portfoliosValue[portfolio.id.toString()].toFixed(2)}
                                </Box>
                            )}
                            </Card.Body>
                            <Card.Footer justifyContent="space-between" alignItems="flex-end">
                            <Popup portfolio={portfolio} title={name_and_description[portfolio.name].name}/>
                            <Button
                                fontWeight="semibold"
                                borderRadius="sm"
                                bgColor="blue.500/30"
                                color="blue.200"
                                padding="1.5rem"
                                _hover={{ bg: "blue.600" }}
                                onClick={() => {setTradePortfolioId(portfolio.id); setOpen(true)}}
                            >
                                {typeOfTrade}
                            </Button>
                            </Card.Footer>
                        </Card.Root>
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

                                

                                        
                                    </VStack>
                                </Flex>
                            </Drawer.Body>
                            
                            <Drawer.Footer>
                                <Button 
                                color="teal.200" 
                                bgColor="teal.600/50"
                                size="xl"
                                px={6} 
                                py={4} 
                                fontSize="sm" 
                                fontWeight="semibold"
                                borderRadius="lg"
                                _hover={{ bg: "teal.800" }}
                                onClick={() => setOpen(false)}
                                >
                                Cancel
                                </Button>
                                <Dialog.Root>
                                        <Dialog.Trigger asChild>
                                            <Button 
                                            color="blue.200" 
                                            size="xl"
                                            bgColor="blue.600/50"
                                            px={6} 
                                            py={4} 
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