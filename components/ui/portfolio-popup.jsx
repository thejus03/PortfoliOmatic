"use client";

import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Stack,
  Box,
  Text,
  Flex,
  Icon
} from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Cell, Pie, PieChart } from "recharts";
import { RiInformationLine } from "react-icons/ri";

// Mapping asset class to colours
const asset_class_to_colour = {
  equity: "blue.800",
  bond: "teal.800",
  gold: "yellow.800",
};

const formatDate = (date) => {
  if (date == undefined) {
    return new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  else {
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } 
}
  

const Popup = ({ portfolio, title }) => {
  if (!portfolio) return null;

  const { created_at, tickers_weight, asset_class_weight } = portfolio;

  // Prepare data for chart
  const chartData = Object.entries(asset_class_weight)
    .filter(([key]) => key !== "returns" && key !== "volatility")
    .map(([key, value]) => ({
      name: key,
      value: Number((value * 100).toFixed(2)),
      color: asset_class_to_colour[key] || "gray.solid",
    }));

  const chart = useChart({ data: chartData });

  // Prepare ticker breakdown
  const tickerList = Object.entries(tickers_weight).map(
    ([ticker, { asset_name, weightage }]) => ({
      label: `${asset_name} (${ticker})`,
      value: `${(weightage * 100).toFixed(2)}%`,
    })
  );

  return (
    <Dialog.Root size="xl" placement="center">
      <Dialog.Trigger asChild>
        <Button variant="outline" borderWidth="2px" borderColor="white" color="white" px={5} py={2} _hover={{ bg: "blue.700"}}>View Details</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="xl" p={6} boxShadow="2xl" maxW="lg">
            <Dialog.Header>
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {title}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap="10">
                {/* Date */}
                <Flex align="start" gap={2}>
                    <Icon as={RiInformationLine} boxSize={5} color="gray.400" mt={0.5} />
                    <Text fontSize="sm" color="gray.400" whiteSpace="pre-line">
                        {`This portfolio was created on: ${formatDate(created_at)}\nOur portfolios undergo rebalancing every month.`}
                    </Text>
                </Flex>

                {/* Pie Chart */}
                <Box h="200px">
                  <Chart.Root boxSize="100%" mx="auto" chart={chart}>
                    <PieChart>
                      <Pie
                        isAnimationActive={true}
                        data={chart.data}
                        dataKey={chart.key("value")}
                        outerRadius={80}
                        innerRadius={0}
                        labelLine={false}
                        label={({ name, index }) => {
                          const { value } = chart.data[index ?? -1];
                          const percent = value / chart.getTotal("value");
                          return `${name}: ${(percent * 100).toFixed(2)}%`;
                        }}
                      >
                        {chart.data.map((item) => (
                          <Cell key={item.name} fill={chart.color(item.color)} />
                        ))}
                      </Pie>
                    </PieChart>
                  </Chart.Root>
                </Box>

                {/* Asset Breakdown */}
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Assets Breakdown:
                  </Text>
                  <Stack gap="2">
                    {tickerList.map(({ label, value }) => (
                      <Box
                        key={label}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Text>{label}</Text>
                        <Text fontWeight="medium">{value}</Text>
                      </Box>
                    ))}
                  </Stack>
                </Box>


                {/* Returns & Volatility */}
                <Box>
                    <Stack gap="2">
                        <Text>
                            <strong>Expected Annual Returns:</strong> {(asset_class_weight.returns * 100).toFixed(2)}%
                        </Text>
                        <Text>
                            <strong>Expected Annual Volatility:</strong> {(asset_class_weight.volatility * 100).toFixed(2)}%
                        </Text>
                        <Stack gap={2}>
                            <Flex align="start" gap={2}>
                                <Icon as={RiInformationLine} boxSize={5} color="gray.400" mt={0.5} />
                                <Text fontSize="sm" color="gray.400" whiteSpace="pre-line">
                                    {`An expected return of ${(asset_class_weight.returns * 100).toFixed(2)}% means the portfolio is projected to grow by 14% annually on average`}
                                </Text>
                            </Flex>
                            <Flex align="start" gap={2}>
                                <Icon as={RiInformationLine} boxSize={5} color="gray.400" mt={0.5} />
                                <Text fontSize="sm" color="gray.400" whiteSpace="pre-line">
                                    {`A volatility of ${(asset_class_weight.volatility * 100).toFixed(2)}% indicates that its annual returns typically deviate ±${(asset_class_weight.volatility * 100).toFixed(2)}% from the average, reflecting the level of risk.`}
                                </Text>
                            </Flex>
                        </Stack>
                    </Stack>
                </Box>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default Popup;
