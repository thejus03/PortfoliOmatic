"use client"
import { 
    VStack, 
    Box, 
    Button, 
    Text,
    Tabs, 
    Flex,
} from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getAllPortfolios, getHoldingPortfolios, getUserPortfolioValue, updateCapitalInvested } from '@/app/apis/portfolio';
import Trade from "@/components/TradePage";
import { toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
    const router = useRouter();
    const [allPortfolios, setAllPortfolios] = useState([])
    const [holdingPortfolios, setHoldingPortfolios] = useState([])
    const [portfoliosValue, setPortfoliosValue] = useState([])
    const [portfolioIdToName, setPortfolioIdToName] = useState({})
    const [buyAmount, setBuyAmount] = useState(0)
    const [sellAmount, setSellAmount] = useState(0)
    const [buyPortfolioId, setBuyPortfolioId] = useState(0)
    const [sellPortfolioId, setSellPortfolioId] = useState(0)
    const [changeMade, setChangeMade] = useState(true)
    const [buyDrawerOpen, setBuyDrawerOpen] = useState(false)
    const [sellDrawerOpen, setSellDrawerOpen] = useState(false)

    const searchParams = useSearchParams();
    const pid = searchParams.get('pid');
    

    const name_and_description = {
        "ultra_low": {"name": "Capital Preservation Portfolio", 
                      "description": "This portfolio prioritizes minimal risk and steady returns by focusing heavily on government bonds and inflation-protected securities. Ideal for conservative investors or those with short investment horizons."
        },
        "low": {"name": "Conservative Income Portfolio",
                "description": "Designed to provide slightly higher returns than ultra-safe assets while still preserving safety, this portfolio mixes high-quality bonds with a modest allocation to defensive stocks and gold."
        },
        "moderate": {"name": "Balanced Growth Portfolio",
                "description": "Perfect for medium-term investors, this diversified portfolio blends equities, bonds, and alternative assets like gold to achieve stable growth without taking on excessive risk."
        },
        "high": {"name": "Growth-Oriented Portfolio",
                "description": "This portfolio leans heavily on equities, especially from growth sectors, to maximize long-term gains, with a small cushion in fixed-income assets to manage volatility."
        },
        "very_high": {"name": "Aggressive Growth Portfolio",
                "description": "Built for those who can stomach market swings, this aggressive portfolio is packed with high-growth equities and minimal defensive allocation. Big risks, but potentially big rewards."
        }
    }

    const handleBuy = async () => {
        
        toaster.create({
            title: "Buying Portfolio",
            description: "Please wait...",
            type: "info",
            duration: 2000
        });

        const token = localStorage.getItem('token')
        let result = null

        if (buyPortfolioId.toString() in portfoliosValue) {
            result = await updateCapitalInvested(token, Number(buyAmount) + Number(portfoliosValue[buyPortfolioId.toString()]), Number(buyPortfolioId))
        } else {
            result = await updateCapitalInvested(token, Number(buyAmount), Number(buyPortfolioId))
        }

        if (result.success) {
            toaster.create({
                title: "Successful",
                description: "Portfolio purchase was successful",
                type: "success",
                duration: 3000
            });
            setChangeMade(change => !change)
        } else {
            toaster.create({
                title: "Unsuccessful",
                description: "Portfolio purchase was unsuccessful",
                type: "error",
                duration: 3000
            });
            console.error("Error updating capital invested after buying");
        }
    }

    const handleSell = async () => {

        toaster.create({
            title: "Selling Portfolio",
            description: "Please wait...",
            type: "info",
            duration: 2000
        });

        const token = localStorage.getItem('token')
        result = await updateCapitalInvested(token, Number(portfoliosValue[sellPortfolioId.toString()]) - Number(sellAmount), Number(sellPortfolioId))

        if (result.success) {
            toaster.create({
                title: "Successful",
                description: "Portfolio sale was successful",
                type: "success",
                duration: 3000
            });
            setChangeMade(change => !change)
        } else {
            toaster.create({
                title: "Unsuccessful",
                description: "Portfolio sale was unsuccessful",
                type: "error",
                duration: 3000
            });
            console.error("Error updating capital invested after selling");
        }
    }
    
    {/* Use Effect to render all holding portfolios every time there is a buy or sell */}
    useEffect(() => {
            const fetchHoldingPortfolios = async () => {
                const token = localStorage.getItem('token');
                const result = await getHoldingPortfolios(token);
                
                if (result.success) {
                    setHoldingPortfolios(result.data);
                } else {
                    console.error("Error fetching portfolio suggestions");
                }
            };

            const fetchAllPortfolios = async () => {
                const token = localStorage.getItem('token');
                const result = await getAllPortfolios(token);
                
                if (result.success) {
                    setAllPortfolios(result.data);
                } else {
                    console.error("Error fetching all portfolios");
                }
            };

            const fetchUserPortfolioValue = async () => {
                const token = localStorage.getItem('token');
                const result = await getUserPortfolioValue(token);

                if (result.success) {
                    setPortfoliosValue(result.data);
                } else {
                    console.error("Error fetching user portfolio value");
                }
            };
    
            fetchHoldingPortfolios();
            fetchAllPortfolios();
            fetchUserPortfolioValue();

        }, [changeMade]);
    
    {/* Use Effect to update default portfolio chosen everytime there is a change to the portfolios */}
    useEffect(() => {
        if (allPortfolios && allPortfolios.length > 0) {
            if (pid == null) {
                setBuyPortfolioId(allPortfolios[0].id);
            } else {
                setBuyPortfolioId(Number(pid));
                setBuyDrawerOpen(true)
            }
            const pidtn = {}
            for (const portfolio of allPortfolios) {
                pidtn[portfolio.id] = name_and_description[portfolio.name].name
            }
            setPortfolioIdToName(pidtn)
        }

        if (holdingPortfolios && holdingPortfolios.length > 0) {
            setSellPortfolioId(holdingPortfolios[0].id);
        }
    }, [allPortfolios, holdingPortfolios]);

    return (
        <div className="w-full min-h-screen bg-slate-950">
        
            {/* Navbar */}
            <div className="w-full h-16 bg-blue-900/90 backdrop-blur-sm border-b border-blue-800/50 flex items-center justify-center shadow-xl shadow-blue-950/50">
                <div className="w-[95%] flex items-center justify-between">
                    <Box
                    textStyle="xl"
                    fontWeight="semibold"
                    letterSpacing="wider"
                    className={spaceGrotesk.className}
                    color="white"
                    >
                    Portfoli-O-matic
                    </Box>
                </div>
            </div>

            
            <Tabs.Root defaultValue="buy" variant="plain">
                {/* Tabs Headers*/}
                <Tabs.List
                bg="gray.700"
                p="2"
                display="flex"
                gap={4} 
                >
                <Tabs.Trigger value="take our risk assessment" px={4} py={2} minW="160px">
                    Take Our Risk Assessment
                </Tabs.Trigger>
                <Tabs.Trigger value="buy" px={4} py={2} minW="100px">
                    Buy New Portfolios
                </Tabs.Trigger>
                <Tabs.Trigger value="sell" px={4} py={2} minW="100px">
                    Sell Current Holdings
                </Tabs.Trigger>
                <Tabs.Indicator rounded="md" />
                </Tabs.List>

                {/* Risk Assessment */}
                <Tabs.Content value="take our risk assessment">
                    <Flex justify="center">
                        <VStack gap={10}>
                            <Text fontSize="3xl">Risk Assessment</Text>
                            <Text fontSize="xl">Unsure which Portfolio best matches your Risk Tolerance?</Text>
                            <Text fontSize="xl">Take our Risk Assessment to algorithmically determine your best match.</Text> 
                            <Button 
                            onClick={() => router.push("/account-setup/risk-preference")}
                            borderWidth="1px"
                            color="white" 
                            borderColor="white" 
                            height="20px"
                            px={6} 
                            py={5} 
                            fontSize="md"
                            borderRadius="md"
                            _hover={{ bg: "blue.800" }}
                            >Click here</Button>
                        </VStack>
                    </Flex>
                </Tabs.Content>

                {/* Buy */}
                <Tabs.Content value="buy">

                    {
                    (buyPortfolioId !== 0 && allPortfolios.length > 0 && (
                    <Trade tradePortfolioId={buyPortfolioId} setTradePortfolioId={setBuyPortfolioId} allPortfolios={allPortfolios} name_and_description={name_and_description} 
                    portfoliosValue={portfoliosValue} portfolioIdToName={portfolioIdToName} open={buyDrawerOpen} setOpen={setBuyDrawerOpen} tradeAmount={buyAmount} setTradeAmount={setBuyAmount}
                    typeOfTrade={"Buy"} upperBound={Infinity} handleTrade={handleBuy}/>
                    )) 
                    }

                </Tabs.Content>

                {/* Sell */}
                <Tabs.Content value="sell">
                    { sellPortfolioId !== 0 && holdingPortfolios.length > 0 && (
                    <Trade tradePortfolioId={sellPortfolioId} setTradePortfolioId={setSellPortfolioId} allPortfolios={holdingPortfolios} name_and_description={name_and_description} 
                    portfoliosValue={portfoliosValue} portfolioIdToName={portfolioIdToName} open={sellDrawerOpen} setOpen={setSellDrawerOpen} tradeAmount={sellAmount} setTradeAmount={setSellAmount}
                    typeOfTrade={"Sell"} upperBound={Number(portfoliosValue[sellPortfolioId.toString()])} handleTrade={handleSell}/>
                    )}
                </Tabs.Content>
            </Tabs.Root>

      </div>
    );
}