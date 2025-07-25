"use client";
import { VStack, Box, Button, Text, Tabs, Flex, Skeleton, Center } from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  getAllPortfolios,
  getHoldingPortfolios,
  getUserPortfolioValue,
  updateCapitalInvested,
} from "@/app/apis/portfolio";
import Trade from "@/components/TradePage";
import { toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { name_and_description } from "@/utils/constants";
import { LuExternalLink } from "react-icons/lu";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  const router = useRouter();
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [holdingPortfolios, setHoldingPortfolios] = useState([]);
  const [portfoliosValue, setPortfoliosValue] = useState(null);
  const [portfolioIdToName, setPortfolioIdToName] = useState({});
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [buyPortfolioId, setBuyPortfolioId] = useState(0);
  const [sellPortfolioId, setSellPortfolioId] = useState(0);
  const [changeMade, setChangeMade] = useState(true);
  const [buyDrawerOpen, setBuyDrawerOpen] = useState(false);
  const [sellDrawerOpen, setSellDrawerOpen] = useState(false);
  const [liquidatePortfolio, setLiquidatePortfolio] = useState(false);

  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");

  const handleBuy = async () => {
    toaster.create({
      title: "Buying Portfolio",
      description: "Please wait...",
      type: "info",
      duration: 2000,
    });

    const token = localStorage.getItem("token");
    let result = null;

    if (buyPortfolioId.toString() in portfoliosValue) {
      result = await updateCapitalInvested(
        token,
        Number(buyAmount) + Number(portfoliosValue[buyPortfolioId.toString()]),
        Number(buyPortfolioId)
      );
    } else {
      result = await updateCapitalInvested(
        token,
        Number(buyAmount),
        Number(buyPortfolioId)
      );
    }

    if (result.success) {
      toaster.create({
        title: "Successful",
        description: "Portfolio purchase was successful",
        type: "success",
        duration: 3000,
      });
      setChangeMade((change) => !change);
    } else {
      toaster.create({
        title: "Unsuccessful",
        description: "Portfolio purchase was unsuccessful",
        type: "error",
        duration: 3000,
      });
      console.error("Error updating capital invested after buying");
    }
  };

  const handleSell = async () => {
    toaster.create({
      title: "Selling Portfolio",
      description: "Please wait...",
      type: "info",
      duration: 2000,
    });

    const token = localStorage.getItem("token");
    let result;

    if (!liquidatePortfolio) {
      result = await updateCapitalInvested(
        token,
        Number(portfoliosValue[sellPortfolioId.toString()]) -
          Number(sellAmount),
        Number(sellPortfolioId)
      );
    } else {
      result = await updateCapitalInvested(token, 0, Number(sellPortfolioId));
    }

    if (result.success) {
      toaster.create({
        title: "Successful",
        description: "Portfolio sale was successful",
        type: "success",
        duration: 3000,
      });
      setChangeMade((change) => !change);
    } else {
      toaster.create({
        title: "Unsuccessful",
        description: "Portfolio sale was unsuccessful",
        type: "error",
        duration: 3000,
      });
      console.error("Error updating capital invested after selling");
    }
  };

  {
    /* Use Effect to render all holding portfolios every time there is a buy or sell */
  }
  useEffect(() => {
    const fetchHoldingPortfolios = async () => {
      const token = localStorage.getItem("token");
      const result = await getHoldingPortfolios(token);

      if (result.success) {
        setHoldingPortfolios(result.data);
      } else {
        console.error("Error fetching portfolio suggestions");
      }
    };

    const fetchAllPortfolios = async () => {
      const token = localStorage.getItem("token");
      const result = await getAllPortfolios(token);

      if (result.success) {
        setAllPortfolios(result.data);
      } else {
        console.error("Error fetching all portfolios");
      }
    };

    const fetchUserPortfolioValue = async () => {
      const token = localStorage.getItem("token");
      const result = await getUserPortfolioValue(token);
      if (result.success) {
        setPortfoliosValue(result.data);
        console.log(result.data);
      } else {
        console.error("Error fetching user portfolio value");
      }
    };

    fetchHoldingPortfolios();
    fetchAllPortfolios();
    fetchUserPortfolioValue();
  }, [changeMade]);

  useEffect(() => {
    if (allPortfolios && allPortfolios.length > 0) {
      if (pid == null) {
        setBuyPortfolioId(allPortfolios[0].id);
      } else {
        setBuyPortfolioId(Number(pid));
        setBuyDrawerOpen(true);
      }
      const pidtn = {};
      for (const portfolio of allPortfolios) {
        pidtn[portfolio.id] = name_and_description[portfolio.name].name;
      }
      setPortfolioIdToName(pidtn);
    }

    if (holdingPortfolios && holdingPortfolios.length > 0) {
      setSellPortfolioId(holdingPortfolios[0].id);
    }
  }, [allPortfolios, holdingPortfolios]);


  return (
    <div className="w-full min-h-screen bg-slate-950 ">
      {/* Navbar */}
      <Navbar />

      <Tabs.Root defaultValue="buy" variant="line" _selected={{ color: "white" }}>
        {/* Tabs Headers*/}
        <Tabs.List
        //   bg="gray.700/40"
          pt="2"  
          pb="0"  
          borderBottom="1px solid"
          borderColor="gray.800"
          display="flex"
          gap={4}
          justifyContent="center"
        >
          <Tabs.Trigger
            value="take our risk assessment"
            px={4}
            py={2}
            borderRadius="md"
            color="white"
            _hover={{ bg: "gray.700/30" }}
          >
            Our Risk Assessment
          </Tabs.Trigger>
          <Tabs.Trigger
            value="buy"
            px={4}
            py={2}
            borderRadius="md"
            color="white"
            _hover={{ bg: "gray.700/30" }}
          >
            Buy New Portfolios
          </Tabs.Trigger>
          <Tabs.Trigger
            value="sell"
            px={4}
            py={2}
            borderRadius="md"
            color="white"
            _hover={{ bg: "gray.700/30",}}
          >
            Sell Current Holdings
          </Tabs.Trigger>
        </Tabs.List>

        {/* Risk Assessment */}
        <Tabs.Content value="take our risk assessment">
          <Flex align="center" justify="center" flexDirection="column">
            <VStack gap={10} className="font-sans">
              <Text fontSize="3xl" className="font-space-grotesk" fontWeight="bold" color="blue.600">Risk Assessment</Text>
              <Text fontSize="xl" color="white">
                Unsure which Portfolio best matches your Risk Tolerance?
              </Text>
              <Text fontSize="xl" color="white">
                Take our Risk Assessment to algorithmically determine your best
                match.
              </Text>
              <Button
                onClick={() => router.push("/account-setup/risk-preference")}
                color="blue.200"
                bgColor="blue.500/30"
                className="font-space-grotesk"
                height="20px"
                px={6}
                py={6}
                fontSize="md"
                borderRadius="full"
                _hover={{ bg: "blue.800",
                  transform: "translateY(-2px)"
                }}
              >
                Click here to take the Risk Assessment
                <LuExternalLink size="25px"/>
              </Button>
            </VStack>
          </Flex>
        </Tabs.Content>

          
        <Tabs.Content value="buy">
          {(buyPortfolioId !== 0 && allPortfolios.length > 0 && portfoliosValue !== null) ? (
            <Trade
              tradePortfolioId={buyPortfolioId}
              setTradePortfolioId={setBuyPortfolioId}
              allPortfolios={allPortfolios}
              name_and_description={name_and_description}
              portfoliosValue={portfoliosValue}
              portfolioIdToName={portfolioIdToName}
              open={buyDrawerOpen}
              setOpen={setBuyDrawerOpen}
              tradeAmount={buyAmount}
              setTradeAmount={setBuyAmount}
              typeOfTrade={"Buy"}
              upperBound={Infinity}
              handleTrade={handleBuy}
              liquidatePortfolio={liquidatePortfolio}
              setLiquidatePortfolio={setLiquidatePortfolio}
            />
          ): (
            <Center minHeight="100vh" width="100%">
              <Box display="flex" flexDirection="row" gap={4} flexWrap="wrap" justifyContent="center" maxWidth="1500px" padding="5">
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
              </Box>
            </Center>
          )}
        </Tabs.Content>

        {/* Sell */}
        <Tabs.Content value="sell">
          {(sellPortfolioId !== 0 && holdingPortfolios.length > 0 && portfoliosValue !== null) ? (
            <Trade
              tradePortfolioId={sellPortfolioId}
              setTradePortfolioId={setSellPortfolioId}
              allPortfolios={holdingPortfolios}
              name_and_description={name_and_description}
              portfoliosValue={portfoliosValue}
              portfolioIdToName={portfolioIdToName}
              open={sellDrawerOpen}
              setOpen={setSellDrawerOpen}
              tradeAmount={sellAmount}
              setTradeAmount={setSellAmount}
              typeOfTrade={"Sell"}
              upperBound={Number(portfoliosValue[sellPortfolioId.toString()])}
              handleTrade={handleSell}
              liquidatePortfolio={liquidatePortfolio}
              setLiquidatePortfolio={setLiquidatePortfolio}
            />
          ): (holdingPortfolios.length == 0) ? 
          (
            <Center minHeight="100vh" width="100%">
              <Box display="flex" flexDirection="row" gap={4} flexWrap="wrap" justifyContent="center" maxWidth="1500px" padding="5">
                <Text>You do not have any portfolios</Text>
              </Box>
            </Center>
          )
          :(
            <Center minHeight="100vh" width="100%">
              <Box display="flex" flexDirection="row" gap={4} flexWrap="wrap" justifyContent="center" maxWidth="1500px" padding="5">
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
                  <Skeleton height="300px" width="500px" borderRadius="lg" />
              </Box>
            </Center>
          )}
        </Tabs.Content>

        {/* Buy */}
      </Tabs.Root>
    </div>
  );
}