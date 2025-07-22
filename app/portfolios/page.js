"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { getChartData } from "@/app/apis/portfolio"
import { Skeleton, Box, Text, Heading } from "@chakra-ui/react";
import PortfolioBreakdown from "@/components/PortfolioBreakdown";

export default function Portfolios() {
    const [chartDatas, setChartDatas] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getChartData(localStorage.getItem("token"));
                setChartDatas(response || {});
            } catch (error) {
                console.error("Error fetching chart data:", error);
                setChartDatas({});
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-slate-950 pb-16">
                <Navbar />
                <Skeleton
                    height="450px"
                    borderRadius="lg"
                    width="90%"
                    alignSelf="center"
                    justifySelf="center"
                    marginX="5rem"
                    marginTop="5rem"
                />
                <Skeleton
                    height="450px"
                    borderRadius="lg"
                    width="90%"
                    alignSelf="center"
                    justifySelf="center"
                    marginX="5rem"
                    marginTop="5rem"
                />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-950 pb-16">
            <Navbar />
            {Object.entries(chartDatas).map(([risk, chartData], index) => {
                if (risk === "total" || !chartData || chartData.length === 0) {
                    return null;
                }
                return (
                    <PortfolioBreakdown 
                        key={risk} 
                        chartData={chartData} 
                        risk={risk}
                        index={index}
                    />
                )
            })}
        </div>
    )
}