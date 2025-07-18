"use client";
import { useState, useEffect } from "react";
import { Chart, useChart } from "@chakra-ui/charts"
import {
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Box, Center, Text, Stat, HStack, Badge, FormatNumber } from "@chakra-ui/react"
import { SegmentGroup, VStack, Skeleton} from "@chakra-ui/react"
import { getChartData } from "@/app/apis/portfolio"

export default function ActivityChart() {
    const [chartData, setChartData] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("1M");
    const [displayData, setDisplayData] = useState([]);
    const [value, setValue] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getChartData(localStorage.getItem("token"));
                setChartData(response);
            } catch (error) {
                console.error("Error fetching chart data:", error);
                setChartData([]);
            }
        };
        
        fetchData();
    }, [])

    useEffect(() => {
        if (chartData.length === 0) {
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
                daysToShow = chartData.length;
                break;
            default:
                daysToShow = 30;
        }
        setValue(chartData[chartData.length - 1].value);
        const filteredData = chartData.slice(-daysToShow);
        setPercentageChange((filteredData[filteredData.length - 1].value - filteredData[0].value) / filteredData[0].value);
        setDisplayData(filteredData);
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

    return (
        <Center marginX="2rem" marginTop="5rem">
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
                {chartData.length === 0 ? (
                    <Skeleton justifyContent="flex-start" alignSelf="flex-start" margin="2rem" height="52px" width="250px" />
                ) : (
                    
                <Stat.Root justifyContent="flex-start" alignSelf="flex-start" margin="2rem">
                    <Stat.Label textStyle="xs" color="gray.400">Value</Stat.Label>
                    <HStack alignItems="center">
                        <Stat.ValueText>
                        <FormatNumber value={value} style="currency" currency="SGD" />
                        </Stat.ValueText>
                        {percentageChange > 0 ? (
                            <Badge colorPalette="green" gap="0">
                            <Stat.UpIndicator />
                            {percentageChange.toFixed(2)}%
                            </Badge>

                        ) : (

                            <Badge colorPalette="red" gap="0">
                            <Stat.DownIndicator />
                            {percentageChange.toFixed(2)}%
                            </Badge>

                        )}
                    </HStack>
                </Stat.Root>
                )}
                {chartData.length === 0 ? (
                    <Skeleton justifyContent="flex-start" alignSelf="flex-start" margin="2rem" height="279px" width="95%" />
                ) : (
                    <>
                        <Chart.Root chart={chart} height="300px" width="100%">
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
                                isAnimationActive={true}
                                dataKey={chart.key(item.name)}
                                fill={`url(#${item.name}-gradient)`}
                                stroke={chart.color(item.color)}
                                strokeWidth={2}
                                stackId="a"
                                // dot={{ fill: chart.color(item.color), fillOpacity:1, strokeWidth: 0.5}}
                                activeDot={true}
                            />
                            ))}
                            </AreaChart> 
                        </Chart.Root>
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
                                bgColor="blue.700/40" 
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