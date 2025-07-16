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
import { Box, Center, Text } from "@chakra-ui/react"
import { SegmentGroup, VStack} from "@chakra-ui/react"
import { getChartData } from "@/app/apis/portfolio"

export default function ActivityChart({ data }) {
    const [chartData, setChartData] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("1M");
    const [displayData, setDisplayData] = useState([]);
    // Get data from the API
    data = {
        "total": [
            { date: "01 Jan 2025", value: 100 },
            { date: "02 Jan 2025", value: 102 },
            { date: "03 Jan 2025", value: 99 },
            { date: "04 Jan 2025", value: 104 },
            { date: "05 Jan 2025", value: 107 },
            { date: "06 Jan 2025", value: 103 },
            { date: "07 Jan 2025", value: 108 },
            { date: "08 Jan 2025", value: 110 },
            { date: "09 Jan 2025", value: 106 },
            { date: "10 Jan 2025", value: 112 },
            { date: "11 Jan 2025", value: 115 },
            { date: "12 Jan 2025", value: 117 },
            { date: "13 Jan 2025", value: 113 },
            { date: "14 Jan 2025", value: 118 },
            { date: "15 Jan 2025", value: 121 },
            { date: "16 Jan 2025", value: 125 },
            { date: "17 Jan 2025", value: 122 },
            { date: "18 Jan 2025", value: 127 },
            { date: "19 Jan 2025", value: 130 }
        ],
        "ultra_low": [
            { date: "01 Jan 2025", value: 100 },
            { date: "02 Jan 2025", value: 200 },
            { date: "03 Jan 2025", value: 150 },
            { date: "04 Jan 2025", value: 300 },
            { date: "05 Jan 2025", value: 250 },
            { date: "06 Jan 2025", value: 400 },
            { date: "07 Jan 2025", value: 500 },
            { date: "08 Jan 2025", value: 600 },
            { date: "09 Jan 2025", value: 700 },
            { date: "10 Jan 2025", value: 800 },
            { date: "11 Jan 2025", value: 900 },
            { date: "12 Jan 2025", value: 1000 },
            { date: "13 Jan 2025", value: 1100 },
            { date: "14 Jan 2025", value: 1200 },
            { date: "15 Jan 2025", value: 1300 },
            { date: "16 Jan 2025", value: 1400 },
            { date: "17 Jan 2025", value: 1500 },
            { date: "18 Jan 2025", value: 1600 },
            { date: "19 Jan 2025", value: 1700 },
        ]
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getChartData(localStorage.getItem("token"));
                setChartData(data["total"]);
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
            case "ALL":
                daysToShow = chartData.length;
                break;
            default:
                daysToShow = 30;
        }

        const filteredData = chartData.slice(-daysToShow);
        setDisplayData(filteredData);
    }, [selectedPeriod, chartData])

    const chart = useChart({
        data: displayData,
        series: [
            {
                name: "value",
                color: "blue.500",
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
                <Text 
                    alignSelf="flex-start" 
                    marginLeft="2rem" 
                    marginTop="2rem"
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="semibold"
                >
                    Value (SGD)
                </Text>
                <Text 
                    alignSelf="flex-start" 
                    marginLeft="2rem" 
                    fontSize="2xl"
                    fontWeight="bold"
                    color="blue.100"
                    letterSpacing="wide"
                    marginBottom="1rem"
                    marginTop="-0.5rem"
                >
                    $200,000.00
                </Text>
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
                                { offset: "0%", color: item.color, opacity: 0.3 },
                                { offset: "100%", color: item.color, opacity: 0.05 },
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
                    />
                    ))}
                    </AreaChart> 
                </Chart.Root>

                <SegmentGroup.Root 
                    size="sm" 
                    defaultValue={selectedPeriod} 
                    marginBottom="1rem"
                    bg="transparent"
                    border="1px solid"
                    borderColor="blue.800"
                    borderRadius="md"
                    letterSpacing="wide"
                    fontWeight="bold"
                    fontSize="sm"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                    <SegmentGroup.Indicator  bg="blue.700" opacity="0.5"/>
                    <SegmentGroup.Items color="gray.400" items={["7D", "1M", "6M", "1Y", "ALL"]} />
                </SegmentGroup.Root>
            </VStack>

            </Box>
        </Center>
    )
}