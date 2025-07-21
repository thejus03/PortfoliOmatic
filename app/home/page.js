"use client";
import ActivityChart from "@/components/ActivityChart";
import LatestNews from "@/components/LatestNews";
import Navbar from "@/components/Navbar";
import TopPerformingPortfolios from "@/components/TopPerformingPortfolios";
import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getChartData } from "@/app/apis/portfolio"

export default function Home() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getChartData(localStorage.getItem("token"));
                setChartData(response["total"]);
            } catch (error) {
                console.error("Error fetching chart data:", error);
                setChartData([]);
            }
        };
        
        fetchData();
    }, [])
  return (
      <div className="w-full min-h-screen bg-slate-950 pb-16">
          <Navbar />
          <Box
            marginTop="4rem"
          >
            <ActivityChart chartData={chartData} />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            width="100%"
            justifyContent="space-between"
            justifySelf="center"
            paddingX="2rem"
            maxWidth="1500px"
          >
            <TopPerformingPortfolios />

            <LatestNews />
          </Box> 
      </div>
  );
}