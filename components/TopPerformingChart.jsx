"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import {
  Badge,
  Card,
  FormatNumber,
  Span,
  Stack,
  Stat,
  Box,
} from "@chakra-ui/react"
import { Area, AreaChart } from "recharts"

export default function TopPerformingChart({ etfData }) {
    const chart = useChart({
        data: etfData.one_week_return_data || [],
        series: [{ name: "value", color: "green.solid" }],
    })
    
    const closing = chart.data[chart.data.length - 1]
    const opening = chart.data[0]
    const trend = closing && opening ? (closing.value - opening.value) / opening.value : etfData.one_week_return / 100

    return (
        <Card.Root 
            width="100%" 
            size="sm" 
            backgroundColor="gray.900/40"
            backdropFilter="blur(10px)"
            border="1px solid" 
            borderColor="gray.800"
            transition="all 0.2s ease-in-out"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
        >
            <Card.Body flexDirection="row" alignItems="center">
                <Stack gap="0" flex="1">
                    <Box fontWeight="semibold" textStyle="sm">
                        {etfData.ticker_symbol}
                    </Box>
                    <Box textStyle="xs" color="fg.muted">
                        ETF
                    </Box>
                </Stack>

                <Chart.Root width="28" height="12" chart={chart}>
                    <AreaChart data={chart.data}>
                        <defs>
                            <Chart.Gradient
                                id={`sp-gradient-${etfData.ticker_symbol}`}
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
                                fill={`url(#sp-gradient-${etfData.ticker_symbol})`}
                                fillOpacity={0.2}
                                stroke={chart.color(item.color)}
                                strokeWidth={2}
                                activeDot={false}
                            />
                        ))}
                    </AreaChart>
                </Chart.Root>

                <Stat.Root size="sm" alignItems="flex-end">
                    <Span fontWeight="medium">
                        <FormatNumber
                            value={closing?.value || 0}
                            style="currency"
                            currency="USD"
                        />
                    </Span>
                    <Badge colorPalette={trend > 0 ? "green" : "red"} gap="0">
                        <Stat.UpIndicator />
                        <FormatNumber
                            value={Math.abs(trend)}
                            style="percent"
                            maximumFractionDigits={2}
                        />
                    </Badge>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    )
}
