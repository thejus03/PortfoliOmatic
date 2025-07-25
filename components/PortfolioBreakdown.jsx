import { Box, Text, HStack, Tag} from "@chakra-ui/react";
import ActivityChart from "@/components/ActivityChart";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getPortfolioByRisk } from "@/app/apis/portfolio";
import { Chart, useChart } from "@chakra-ui/charts";
import { Pie, PieChart, Cell, Tooltip, Legend, Label } from "recharts";
import { LuArrowUpRight } from "react-icons/lu";
import { name_and_description } from "@/utils/constants";


const AssetBreakdownChart = ({ title, data }) => {
    const chart = useChart({ data });
    
    if (!data || data.length === 0) return null;

    return (
        <Box 
            width="350px"
            height="400px"
            border="1px solid"
            borderColor="gray.800"
            backdropFilter="blur(10px)"
            backgroundColor="gray.900/30"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
        >
            <HStack justifyContent="space-between" width="100%" paddingRight="0.5rem">
                <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    color="gray.300" 
                    className="font-sans tracking-wider"
                    alignSelf="center" 
                    marginTop="0.5rem"
                    paddingLeft="1.5rem"
                    width="100%"
                >
                    {title}
                </Text>
                <LuArrowUpRight
                    size={30}
                    color="blue.300"
                />
            </HStack>
            <Chart.Root boxSize="350px" chart={chart}>
                <PieChart>
                    <Tooltip
                        cursor={false}
                        animationDuration={100}
                        content={<Chart.Tooltip hideLabel />}
                    />
                    {title === "Asset Class" && (
                        <Legend content={<Chart.Legend />} />
                    )}
                    
                    <Pie
                        isAnimationActive={true}
                        innerRadius={80}
                        outerRadius={120}
                        data={chart.data}
                        dataKey={chart.key("value")}
                        stroke="none"
                    >
                        {chart.data.map((item) => (
                            <Cell key={item.name} fill={chart.color(item.color)} />
                        ))}
                    </Pie>
                </PieChart>
            </Chart.Root>
        </Box>
    );
};


export default function PortfolioBreakdown({chartData, risk, index, performanceData}) {
    const asset_class_to_colour = {
        equity: "blue.600",
        bond: "teal.600",
        gold: "yellow.600",
    };

    const equity_colors = [
        "blue.400", "purple.400", "orange.400",
        "blue.600", "purple.600", "orange.600",
        "blue.800", "purple.800", "orange.800"
    ];
    const bond_colors = [
        "teal.400", "cyan.400", "orange.400",
        "teal.600", "cyan.600", "orange.600",
        "teal.800", "cyan.800", "orange.800"
    ];

    const gold_colors = [
        "yellow.400", "orange.400", "amber.400",
        "yellow.600", "orange.600", "amber.600",
        "yellow.800", "orange.800", "amber.800"
    ];

    const [asset_class_weight, setAssetClassWeight] = useState({});
    const [tickers_weight, setTickersWeight] = useState({});

    useEffect(() => {
        const fetchPortfolio = async () => {
            const response = await getPortfolioByRisk(risk, localStorage.getItem("token"))
            if (response.success) {
                setAssetClassWeight(response.data[0].asset_class_weight);
                setTickersWeight(response.data[0].tickers_weight);
            } else {
                console.error("Error fetching portfolio:", response.error);
            }
        }
        fetchPortfolio();
    }, [risk]);


    const assetClassData = Object.entries(asset_class_weight)
        .filter(([key]) => key !== "returns" && key !== "volatility")
        .map(([key, value]) => ({
            name: key,
            value: Number((value * 100).toFixed(2)),
            color: asset_class_to_colour[key] || "gray.solid",
        }));

    // Helper function to create breakdown data for specific asset class
    const createAssetClassBreakdown = useCallback((assetClass, colors) => {
        return Object.entries(tickers_weight)
            .filter(([ticker, data]) => data.asset_class === assetClass)
            .map(([ticker, data], index) => ({
                name: data.asset_name,
                value: Number(((data.weightage * 100) / asset_class_weight[assetClass]).toFixed(2)),
                color: colors[index % colors.length],
            }));
    }, [asset_class_weight, tickers_weight]);

    // mapping asset class to colors
    const equityData = useMemo(() => createAssetClassBreakdown("equity", equity_colors), [createAssetClassBreakdown]);
    const bondData = useMemo(() => createAssetClassBreakdown("bond", bond_colors), [createAssetClassBreakdown]);
    const goldData = useMemo(() => createAssetClassBreakdown("gold", gold_colors), [createAssetClassBreakdown]);
    console.log("assetClassData", assetClassData);
    console.log("equityData", equityData);
    console.log("bondData", bondData);
    console.log("goldData", goldData);
    return (
        <Box>
            <HStack alignItems="center" gap="1rem" marginTop="5rem" marginLeft="4rem">
                <Text fontSize="3xl" fontWeight="bold" className="font-space-grotesk" color="white">
                    {name_and_description[risk].name}
                </Text>
                <Tag.Root 
                    size="md" 
                    variant="subtle"
                    colorPalette="gray"
                    className="font-sans tracking-wide"
                    borderColor="gray.700"
                    bgColor="gray.800/60"
                    backdropFilter="blur(10px)"
                    borderRadius="md"
                    paddingX="0.5rem"
                >
                    <Tag.Label color="gray.300" fontSize="xs" fontWeight="medium">
                        {risk.charAt(0).toUpperCase() + risk.slice(1).replace('_', ' ')}
                    </Tag.Label>
                </Tag.Root>
            </HStack>
            <ActivityChart chartData={chartData} performanceData={performanceData} />
            <Box
                display="flex"
                flexDirection="row"
                width="100%"
                justifyContent="center"
                justifySelf="center"
                paddingX="4rem"
                marginTop="3rem"
                maxWidth="1500px"
                flexWrap="wrap"
                gap="0.5rem"
            >
                {/* Asset Class Breakdown */}
                <AssetBreakdownChart 
                    title="Asset Class"  
                    data={assetClassData} 
                />

                {/* Equity Breakdown */}
                {equityData.length > 0 && (
                    <AssetBreakdownChart 
                        title="Equity Breakdown" 
                        data={equityData} 
                    />
                )}

                {/* Bond Breakdown */}
                {bondData.length > 0 && (
                    <AssetBreakdownChart 
                        title="Bond Breakdown" 
                        data={bondData} 
                    />
                )}

                {/* Gold Breakdown */}
                {goldData.length > 0 && (
                    <AssetBreakdownChart 
                        title="Gold Breakdown" 
                        data={goldData} 
                    />
                )}
            </Box>
        </Box>
    )
}