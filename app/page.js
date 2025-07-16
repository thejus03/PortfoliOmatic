import ActivityChart from "@/components/ActivityChart";
import { VStack, Box, Button } from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
      <div className="w-full min-h-screen bg-slate-950">
          {/* Header */}
          <div className="w-full h-16 bg-blue-900/90 backdrop-blur-sm border-b border-blue-800/50 flex items-center justify-center shadow-xl shadow-blue-950/50">
              <div className="w-[95%] flex items-center justify-between">
                  <Box
                  textStyle="xl"
                  fontWeight="semibold"
                  letterSpacing="wider"
                  className={spaceGrotesk.className}
                  color="white"
                  >
                  Portfoli-O-matic
                  </Box>
              </div>
          </div>
          <ActivityChart data={[]} />
      </div>
  );
}