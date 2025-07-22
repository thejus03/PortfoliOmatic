"use client";
import { useState, useEffect, useCallback } from "react";
import { Chart, useChart } from "@chakra-ui/charts"
import {
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Box, Center, Text, Stat, HStack, Badge, Button } from "@chakra-ui/react"
import { SegmentGroup, VStack, Skeleton} from "@chakra-ui/react"

const formatCurrency = (value) => {
    const formatted = value.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
    const [integerPart, decimalPart] = formatted.split('.');
    
    return (
        <Text fontSize="4xl"  whiteSpace="nowrap" className="tracking-wider font-space-grotesk">
            {integerPart}
            <Text as="span" fontSize="2xl" className="tracking-wider font-space-grotesk">.{decimalPart}</Text>
        </Text>
    );
};

const formatChangeValue = (change) => {
    const isPositive = change > 0;
    const color = isPositive ? "green.400" : "red.400";
    const prefix = isPositive ? "+" : "";
    
    return (
        <Text 
            color={color} 
            fontSize="xl" 
            fontWeight="bold" 
            className="tracking-wide font-sans"
        >
            {prefix}{change.toFixed(2)}
        </Text>
    );
};

const NetLiquidityDisplay = ({ value }) => (
    <Stat.Root justifyContent="flex-start" alignSelf="center" margin="2rem">
        <Stat.Label textStyle="xs" color="gray.400" className="font-sans tracking-wide">
            Net Liquidity (SGD)
        </Stat.Label>
        <HStack alignItems="center">
            <Stat.ValueText>
                {formatCurrency(value)}
            </Stat.ValueText>
        </HStack>
    </Stat.Root>
);

// Component for the change display
const NavChangeDisplay = ({ valueChange, percentageChange, selectedPeriod }) => (
    <Stat.Root justifyContent="flex-start" alignSelf="flex-start" margin="2rem">
        <Stat.Label textStyle="xs" color="gray.400" className="font-sans tracking-wide">
            NAV Change ({selectedPeriod})
        </Stat.Label>
        <HStack className="font-sans">
            <Stat.ValueText>
                {formatChangeValue(valueChange)}
            </Stat.ValueText>
            {percentageChange > 0 ? (
                <Badge colorPalette="green" gap="0" className="font-sans" fontSize="10px" fontWeight="bold">
                    <Stat.UpIndicator />
                    {percentageChange.toFixed(2)}%
                </Badge>
            ) : (
                <Badge colorPalette="red" gap="0" fontFamily="body" fontSize="10px" fontWeight="bold">
                    <Stat.DownIndicator />
                    {percentageChange.toFixed(2)}%
                </Badge>
            )}
        </HStack>
    </Stat.Root>
);

const DailyChangeDisplay = ({ valueChange, percentageChange }   ) => {
    return (
        <Stat.Root justifyContent="flex-start" alignSelf="flex-start" margin="2rem">
        <Stat.Label textStyle="xs" color="gray.400" className="font-sans tracking-wide">
            Daily P&L
        </Stat.Label>
        <HStack className="font-sans">
            <Stat.ValueText>
                {formatChangeValue(valueChange)}
            </Stat.ValueText>
            {percentageChange > 0 ? (
                <Badge colorPalette="green" gap="0" className="font-sans" fontSize="10px" fontWeight="bold">
                    <Stat.UpIndicator />
                    {percentageChange.toFixed(2)}%
                </Badge>
            ) : (
                <Badge colorPalette="red" gap="0" fontFamily="body" fontSize="10px" fontWeight="bold">
                    <Stat.DownIndicator />
                    {percentageChange.toFixed(2)}%
                </Badge>
            )}
        </HStack>
    </Stat.Root>
    )
}

function TabDisplay( {tab, setTab} ) {
    const getButtonStyles = useCallback((button) => {
        const isActive = button === tab;

        return {
            color: isActive ? "blue.400" : "gray.400",
            bgColor: isActive ? "blue.600/20" : "transparent",
            borderRadius: "sm",
            fontSize:"13px",
            fontWeight: isActive ? "bold" : "semibold",
            paddingX: "1rem",
            paddingY: "0.5rem",
            size: "sm",
            _hover: {
                bgColor: "blue.600/20",
                color: "blue.400",
            },
        }
    }, [tab])
    
    return (
        <Box display="flex" flexDirection="row" gap="1rem" margin='2rem' justifyContent='flex-end' width='100%' className="font-sans">
            <Button 
                onClick={() => setTab("value")} 
                {...getButtonStyles("value")}
            >
                Value
            </Button>
            <Button 
                onClick={() => setTab("performance")} 
                {...getButtonStyles("performance")}
            >
                Performance
            </Button>
        </Box>
    )
    
}

export default function ActivityChart( {chartData} ) {
    const [selectedPeriod, setSelectedPeriod] = useState("1M");
    const [displayData, setDisplayData] = useState([]);
    const [value, setValue] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);
    const [valueChange, setValueChange] = useState(0);
    const [dailyValueChange, setDailyValueChange] = useState(0);
    const [dailyPercentageChange, setDailyPercentageChange] = useState(0);
    const [tab, setTab] = useState("value") // value or performance

    // Remove later
    // Calculate gradient offset for performance chart (positive/negative areas)
    const gradientOffset = () => {
        if (!displayData || displayData.length === 0) return 0.5;
        
        // Convert portfolio values to performance values (difference from first value)
        const firstValue = displayData[0]?.value || 0;
        const performanceData = displayData.map(item => item.value - firstValue);
        
        const max = Math.max(...performanceData);
        const min = Math.min(...performanceData);
        
        if (max <= 0) return 0;
        if (min >= 0) return 1;
        return max / (max - min);
    }

    const offset = gradientOffset();

    useEffect(() => {
        if (chartData?.length === 0) {
            setDisplayData([]);
            return;
        }

        let daysToShow;
        switch (selectedPeriod) {
            case "7D":
                daysToShow = 7;
                break;
            case "1M":
                daysToShow = 30;
                break;
            case "6M":
                daysToShow = 180;
                break;
            case "1Y":
                daysToShow = 365;
                break;
            case "All":
                daysToShow = chartData?.length;
                break;
            default:
                daysToShow = 30;
        }
        setValue(chartData[chartData?.length - 1].value);
        const filteredData = chartData.slice(-daysToShow);
        setValueChange(filteredData[filteredData.length - 1].value - filteredData[0].value);
        setPercentageChange(((filteredData[filteredData.length - 1].value - filteredData[0].value) / filteredData[0].value) * 100);
        setDisplayData(filteredData);
        setDailyValueChange(filteredData[filteredData.length - 1].value - filteredData[filteredData.length - 2].value);
        setDailyPercentageChange(((filteredData[filteredData.length - 1].value - filteredData[filteredData.length - 2].value) / filteredData[filteredData.length - 2].value) * 100);
    }, [selectedPeriod, chartData, value, percentageChange])

    const chart = useChart({
        data: displayData,
        series: [
            {
                name: "value",
                color: "blue.400",
            }
        ],
    });

    // Create performance data (difference from first value) for the performance chart
    const performanceChart = useChart({
        data: displayData.map((item, index) => ({
            ...item,
            performance: displayData.length > 0 ? item.value - displayData[0].value : 0
        })),
        series: [
            {
                name: "performance",
                color: "gray.solid",
            }
        ],
    });

    return (
        <Center marginX="2rem" marginTop="1rem">
            <Box 
                width="95%"
                border="1px solid"
                borderColor="gray.800"
                borderRadius="sm"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <VStack width="100%">
                    {chartData?.length === 0 ? (
                        <Skeleton justifyContent="flex-start" alignSelf="flex-start" margin="2rem" height="52px" width="250px" />
                    ) : (
                        <Box display="flex" flexDirection="row" gap="2rem" alignSelf="flex-start" width="100%">
                            <NetLiquidityDisplay value={value} />
                            <NavChangeDisplay 
                                valueChange={valueChange} 
                                percentageChange={percentageChange} 
                                selectedPeriod={selectedPeriod} 
                            />
                            <DailyChangeDisplay 
                                valueChange={dailyValueChange} 
                                percentageChange={dailyPercentageChange} 
                            />
                            <TabDisplay tab={tab} setTab={setTab} />
                        </Box> 
                    )}
                    {chartData?.length === 0 ? (
                        <Skeleton justifyContent="flex-start" alignSelf="flex-start" margin="2rem" height="279px" width="95%" />
                    ) : (
                        <>
                            {tab.includes("value") && (
                                <Chart.Root chart={chart} height="300px" width="100%" className="font-sans" fontSize="10px" fontWeight="bold">
                                <AreaChart data={chart.data} margin={{ left: 0, bottom: 0, right: 0, top: 0 }}>
                                <CartesianGrid 
                                    stroke="gray" 
                                    vertical={false} 
                                    opacity={0.2}
                                    strokeDasharray="2 2"
                                    />
                                
                                <XAxis 
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={0}
                                    display="none"
                                    stroke={chart.color("border")}
                                    />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: "10px" }}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                    dataKey={chart.key("value")}
                                    stroke={chart.color("border")}
                                    />
                                <Tooltip
                                    animationDuration={100}
                                    cursor={{ stroke: chart.color("border") }}
                                    content={<Chart.Tooltip />}
                                    />
                                {chart.series.map((item) => (
                                    <defs key={item.name}>
                                        <Chart.Gradient
                                        id={`${item.name}-gradient`}
                                        stops={[
                                            { offset: "0%", color: item.color, opacity: 0.2 },
                                            { offset: "100%", color: item.color, opacity: 0 },
                                        ]}
                                        />
                                    </defs>
                                    ))}
                                {chart.series.map((item) => (
                                <Area
                                    key={item.name}
                                    isAnimationActive={false}
                                    dataKey={chart.key(item.name)}
                                    fill={`url(#${item.name}-gradient)`}
                                    stroke={chart.color(item.color)}
                                    strokeWidth={2}
                                    stackId="a"
                                    activeDot={true}
                                />
                                ))}
                                </AreaChart> 
                                </Chart.Root>
                            )}
                            
                            {tab.includes("performance") && (
                               <Chart.Root chart={performanceChart} height="300px" width="100%" className="font-sans" fontSize="10px" fontWeight="bold">
                                <AreaChart data={performanceChart.data} margin={{ left: 0, bottom: 0, right: 0, top: 0 }}>
                                <CartesianGrid 
                                    stroke="gray" 
                                    vertical={false} 
                                    opacity={0.2}
                                    strokeDasharray="2 2"
                                    />
                                
                                <XAxis 
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={0}
                                    display="none"
                                    stroke={performanceChart.color("border")}
                                    />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: "10px" }}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                    dataKey={chart.key("value")}
                                    stroke={chart.color("border")}
                                    />
                                <Tooltip
                                    animationDuration={100}
                                    cursor={{ stroke: performanceChart.color("border") }}
                                    content={<Chart.Tooltip />}
                                    />
                                <defs>
                                    <Chart.Gradient
                                        id="performance-gradient"
                                        stops={[
                                            { offset, color: "teal.solid", opacity: 1 },
                                            { offset, color: "red.solid", opacity: 1 },
                                        ]}
                                    />
                                </defs>
                                <Area
                                    type="monotone"
                                    isAnimationActive={false}
                                    dataKey={performanceChart.key("performance")}
                                    fill="url(#performance-gradient)"
                                    fillOpacity={0.2}
                                    stroke={performanceChart.color("gray")}
                                    strokeWidth={2}
                                />
                                </AreaChart> 
                                </Chart.Root>
                            )}
                            
                            <SegmentGroup.Root 
                                size="sm" 
                                defaultValue={selectedPeriod} 
                                marginBottom="1rem"
                                marginTop="-1rem"
                                border="none"
                                borderColor="transparent"
                                bgColor="transparent"
                                borderRadius="2xl"
                                letterSpacing="wide"
                                fontWeight="bold"
                                fontSize="sm"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                padding="0.1rem"
                            >
                                <SegmentGroup.Indicator  
                                    bgColor="blue.700/30" 
                                    borderRadius="2xl" 
                                    backdropFilter="blur(10px)"
                                    border="1px solid"
                                    borderColor="blue.700/20"
                                />
                                <SegmentGroup.Items 
                                    color="gray.300" 
                                    items={["7D", "1M", "6M", "1Y", "All"]} 
                                    _hover={{
                                        color: "blue.400",
                                        bgColor: "transparent",
                                        borderRadius: "lg"
                                    }}
                                    _checked={{
                                        color: "blue.400",
                                    }}
                                    transition="all 0.15s ease-in-out"
                                    paddingX="1rem"
                                    paddingY="0.5rem"
                                />
                            </SegmentGroup.Root>
                        </>
                    )}

                </VStack>

            </Box>
        </Center>
    )
}