"use client"

import { Heading, Box, Center } from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import { Chart, useChart } from "@chakra-ui/charts"
import {
  Badge,
  Card,
  FormatNumber,
  Span,
  Stack,
  Stat,
} from "@chakra-ui/react"
import { Area, AreaChart } from "recharts"

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function TopPerformingPortfolios() {
    const chart = useChart({
        data: [
          { date: "2023-01", value: 145.43 },
          { date: "2023-02", value: 151.73 },
          { date: "2023-03", value: 157.65 },
          { date: "2023-04", value: 169.68 },
          { date: "2023-05", value: 173.75 },
          { date: "2023-06", value: 186.68 },
          { date: "2023-07", value: 181.99 },
          { date: "2023-08", value: 199.46 },
        ],
        series: [{ name: "value", color: "green.solid" }],
      })
    
      const closing = chart.data[chart.data.length - 1]
      const opening = chart.data[0]
      const trend = (closing.value - opening.value) / opening.value

    return (
        <Center marginX="2rem" marginTop="4rem">
            <Box 
                width="95%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Heading
                    textStyle="xl"
                    fontWeight="semibold"
                    className={spaceGrotesk.className}
                    color="white"
                    alignSelf="flex-start"
                >
                    Top Performing Portfolios
                </Heading>
                <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    marginTop="2rem"
                    gap="1rem"
                >

                    <Card.Root maxW="sm" size="sm" bgColor="cyan.950" >
                        <Card.Body flexDirection="row" alignItems="center" >
                            <Stack gap="0" flex="1">
                            <Box fontWeight="semibold" textStyle="sm">
                                AMZN
                            </Box>
                            <Box textStyle="xs" color="fg.muted">
                                Amazon Inc.
                            </Box>
                            </Stack>

                            <Chart.Root width="28" height="12" chart={chart}>
                            <AreaChart data={chart.data}>
                                <defs>
                                <Chart.Gradient
                                    id="sp-gradient"
                                    stops={[
                                    { offset: 0, color: "green.solid", opacity: 0.8 },
                                    { offset: 1, color: "green.solid", opacity: 0.2 },
                                    ]}
                                />
                                </defs>
                                {chart.series.map((item) => (
                                <Area
                                    key={item.name}
                                    isAnimationActive={false}
                                    dataKey={chart.key(item.name)}
                                    fill={`url(#sp-gradient)`}
                                    fillOpacity={0.2}
                                    stroke={chart.color(item.color)}
                                    strokeWidth={2}
                                />
                                ))}
                            </AreaChart>
                            </Chart.Root>

                            <Stat.Root size="sm" alignItems="flex-end">
                            <Span fontWeight="medium">
                                <FormatNumber
                                value={closing.value}
                                style="currency"
                                currency="USD"
                                />
                            </Span>
                            <Badge colorPalette={trend > 0 ? "green" : "red"} gap="0">
                                <Stat.UpIndicator />
                                <FormatNumber
                                value={trend}
                                style="percent"
                                maximumFractionDigits={2}
                                />
                            </Badge>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>
                    <Card.Root maxW="sm" size="sm" bgColor="cyan.950" >
                        <Card.Body flexDirection="row" alignItems="center">
                            <Stack gap="0" flex="1">
                            <Box fontWeight="semibold" textStyle="sm">
                                AMZN
                            </Box>
                            <Box textStyle="xs" color="fg.muted">
                                Amazon Inc.
                            </Box>
                            </Stack>

                            <Chart.Root width="28" height="12" chart={chart}>
                            <AreaChart data={chart.data}>
                                <defs>
                                <Chart.Gradient
                                    id="sp-gradient"
                                    stops={[
                                    { offset: 0, color: "green.solid", opacity: 0.8 },
                                    { offset: 1, color: "green.solid", opacity: 0.2 },
                                    ]}
                                />
                                </defs>
                                {chart.series.map((item) => (
                                <Area
                                    key={item.name}
                                    isAnimationActive={false}
                                    dataKey={chart.key(item.name)}
                                    fill={`url(#sp-gradient)`}
                                    fillOpacity={0.2}
                                    stroke={chart.color(item.color)}
                                    strokeWidth={2}
                                />
                                ))}
                            </AreaChart>
                            </Chart.Root>

                            <Stat.Root size="sm" alignItems="flex-end">
                            <Span fontWeight="medium">
                                <FormatNumber
                                value={closing.value}
                                style="currency"
                                currency="USD"
                                />
                            </Span>
                            <Badge colorPalette={trend > 0 ? "green" : "red"} gap="0">
                                <Stat.UpIndicator />
                                <FormatNumber
                                value={trend}
                                style="percent"
                                maximumFractionDigits={2}
                                />
                            </Badge>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>
                </Box>
            </Box>
        </Center>
    )
}