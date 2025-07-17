import ActivityChart from "@/components/ActivityChart";
import Navbar from "@/components/Navbar";
import TopPerformingPortfolios from "@/components/TopPerformingPortfolios";
import { VStack, Box, Button } from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
      <div className="w-full min-h-screen bg-slate-950 pb-16">
          <Navbar />
          
          <ActivityChart />
          
          <TopPerformingPortfolios />
      </div>
  );
}