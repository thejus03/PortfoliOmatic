import ActivityChart from "@/components/ActivityChart";
import LatestNews from "@/components/LatestNews";
import Navbar from "@/components/Navbar";
import TopPerformingPortfolios from "@/components/TopPerformingPortfolios";
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
      <div className="w-full min-h-screen bg-slate-950 pb-16">
          <Navbar />
          
          <ActivityChart />
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