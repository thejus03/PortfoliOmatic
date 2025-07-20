"use client"

import { Heading, Box, Center } from "@chakra-ui/react";
import { getTopPerformingETFs } from "@/app/apis/portfolio"
import { useState, useEffect } from "react"
import TopPerformingChart from "./TopPerformingChart"
import { Skeleton, VStack } from "@chakra-ui/react"

export default function TopPerformingPortfolios() {
    const [topPerformingETFs, setTopPerformingETFs] = useState([])

    useEffect(() => {
        const fetchTopPerformingETFs = async () => {
            try {
                const response = await getTopPerformingETFs(localStorage.getItem("token"))
                console.log("ETF Response:", response) // Debug log
                
                if (response && response.success && Array.isArray(response.data?.data)) {
                    setTopPerformingETFs(response.data.data)
                } else {
                    console.error("Failed to fetch ETFs:", response?.error || "Unknown error")
                    setTopPerformingETFs([])
                }
            } catch (error) {
                console.error("Error fetching ETFs:", error)
                setTopPerformingETFs([])
            }
        }
        fetchTopPerformingETFs()
    }, [])

    

    return (
        <Box marginX="2rem" marginTop="4rem" >
            <Box 
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Heading
                    textStyle="xl"
                    fontWeight="semibold"
                    className="font-sans"
                    color="white"
                    alignSelf="flex-start"
                >
                    Top Performing ETFs
                </Heading>
                <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    marginTop="2rem"
                    gap="0.95rem"
                    minWidth="300px"
                >

                    {topPerformingETFs.length > 0 ? (
                        topPerformingETFs.map((etf) => (
                            <TopPerformingChart key={etf.ticker_symbol} etfData={etf} />
                        ))
                    ) : (
                        <>
                            <Skeleton height="82px" width="100%" borderRadius="lg" />
                            <Skeleton height="82px" width="100%" borderRadius="lg" />
                            <Skeleton height="82px" width="100%" borderRadius="lg" />
                            <Skeleton height="82px" width="100%" borderRadius="lg" />
                            <Skeleton height="82px" width="100%" borderRadius="lg" />
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    )
}