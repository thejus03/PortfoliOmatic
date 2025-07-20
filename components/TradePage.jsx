"use client"
import { 
    VStack, 
    Box, 
    Button, 
    Text, 
    SimpleGrid, 
    For, 
    Card, 
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
    Center
} from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAllPortfolios, getHoldingPortfolios, getUserPortfolioValue, updateCapitalInvested } from '@/app/apis/portfolio';
import { LuDollarSign } from "react-icons/lu";
import Popup from "@/components/ui/portfolio-popup";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export default function Trade({tradePortfolioId, setTradePortfolioId, allPortfolios, name_and_description, portfoliosValue, portfolioIdToName,
                              open, setOpen, tradeAmount, setTradeAmount, typeOfTrade, upperBound, handleTrade}) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" padding="5">
            <Text fontWeight="semibold" textStyle="3xl" padding={5}>{typeOfTrade} a Portfolio</Text>

            <RadioCard.Root value={tradePortfolioId} onValueChange={(e) => setTradePortfolioId(e.value)}>
                <RadioCard.Label display="flex" flexDirection="column" alignItems="center">
                    <Text fontWeight="semibold" textStyle="xl" padding={5}>
                        Select a Portfolio to {typeOfTrade}
                    </Text>
                </RadioCard.Label>

                {/* render only a even number of portfolios */}
                <SimpleGrid columns={2} gap="40px">
                    <For each={allPortfolios.slice(0, allPortfolios.length % 2 === 0 ? allPortfolios.length : allPortfolios.length - 1)}>
                        {(portfolio, index) => (
                        <RadioCard.Item 
                            key={portfolio.id} 
                            value={portfolio.id} 
                            bg="blue.900" 
                            height="300px" 
                            width="500px"
                            rounded="xl"
                            onClick={() => setOpen(true)}>
                            <RadioCard.ItemHiddenInput />
                            <RadioCard.ItemControl>
                            <RadioCard.ItemContent>
                                <RadioCard.ItemText fontSize="lg">{name_and_description[portfolio.name].name}</RadioCard.ItemText>
                                <RadioCard.ItemDescription fontSize="md">
                                    <Text>{name_and_description[portfolio.name].description}</Text>
                                </RadioCard.ItemDescription>
                                <Button borderWidth="2px" bgColor="blue.900" borderColor="white" color="white" px={2} py={2} mt={10}>
                                    <Text fontSize="xl" fontWeight="bold" color="white">
                                    Current Holding: $
                                    {portfoliosValue[portfolio.id.toString()]
                                        ? Math.floor(portfoliosValue[portfolio.id.toString()] * 100) / 100
                                        : 0}
                                    </Text>
                                </Button>
                            </RadioCard.ItemContent>
                            <RadioCard.ItemIndicator />
                            </RadioCard.ItemControl>
                            <RadioCard.ItemAddon>
                                <HStack spacing={4} align="center">
                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <Popup portfolio={portfolio} title={name_and_description[portfolio.name].name} />
                                    </Box>
                                </HStack>
                            </RadioCard.ItemAddon>
                        </RadioCard.Item>
                        )}
                    </For>

                    {/* If there's an odd number of portfolios, centre the last one */}
                    {allPortfolios.length % 2 !== 0 && (
                        <Flex justify="center" align="center" gridColumn="1 / -1">
                            <Box width="500px">
                                <RadioCard.Item
                                    key={allPortfolios[allPortfolios.length - 1].id}
                                    value={allPortfolios[allPortfolios.length - 1].id}
                                    bg="blue.900"
                                    height="300px"
                                    width="500px"
                                    rounded="xl"
                                    onClick={() => setOpen(true)}
                                >
                                    <RadioCard.ItemHiddenInput />
                                    <RadioCard.ItemControl>
                                    <RadioCard.ItemContent>
                                        <RadioCard.ItemText fontSize="lg">{name_and_description[allPortfolios[allPortfolios.length - 1].name].name}</RadioCard.ItemText>
                                        <RadioCard.ItemDescription fontSize="md">
                                        {name_and_description[allPortfolios[allPortfolios.length - 1].name].description}
                                        </RadioCard.ItemDescription>
                                        <Button borderWidth="2px" bgColor="blue.900" borderColor="white" color="white" px={2} py={2} mt={10}>
                                            <Text fontSize="xl" fontWeight="bold" color="white">
                                            Current Holding: $
                                            {portfoliosValue[allPortfolios[allPortfolios.length - 1].id.toString()]
                                                ? Math.floor(portfoliosValue[allPortfolios[allPortfolios.length - 1].id.toString()] * 100) / 100
                                                : 0}
                                            </Text>
                                        </Button>
                                    </RadioCard.ItemContent>
                                    <RadioCard.ItemIndicator />
                                    </RadioCard.ItemControl>
                                    <RadioCard.ItemAddon>
                                        <HStack spacing={4} align="center">
                                            <Box onClick={(e) => e.stopPropagation()}>
                                                <Popup portfolio={allPortfolios[allPortfolios.length - 1]} title={name_and_description[allPortfolios[allPortfolios.length - 1].name].name} />
                                            </Box>
                                        </HStack>
                                    </RadioCard.ItemAddon>
                                </RadioCard.Item>
                            </Box>
                        </Flex>
                    )}
                </SimpleGrid>
            </RadioCard.Root>

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

                                        <Text>
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
                                fontSize="lg" 
                                fontWeight="bold"
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
                                            fontSize="lg" 
                                            fontWeight="bold"
                                            borderRadius="lg"
                                            _hover={{ bg: "blue.800" }}
                                            >
                                            {typeOfTrade}
                                            </Button>
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
                                                    ) : (
                                                        <Text fontSize="md">Invalid {typeOfTrade} amount</Text>
                                                    )}
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
                                                    {(tradeAmount > 0 && tradeAmount < upperBound) &&
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