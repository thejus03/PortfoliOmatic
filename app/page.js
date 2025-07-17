import ActivityChart from "@/components/ActivityChart";
import Navbar from "@/components/Navbar";
import TopPerformingPortfolios from "@/components/TopPerformingPortfolios";

export default function Home() {
  return (
      <div className="w-full min-h-screen bg-slate-950 pb-16">
          <Navbar />
          
          <ActivityChart />
          
          <TopPerformingPortfolios />
      </div>
  );
}