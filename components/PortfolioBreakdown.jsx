import { Box } from "@chakra-ui/react";
import ActivityChart from "@/components/ActivityChart";
import { useState, useEffect } from "react";
import { getPortfolioByRisk } from "@/app/apis/portfolio";

export default function PortfolioBreakdown({chartData, risk}) {
    const [portfolio, setPortfolio] = useState(null)
    useEffect(() => {
        const fetchPortfolio = async () => {
            const response = await getPortfolioByRisk(risk, localStorage.getItem("token"))
            if (response.success) {
                setPortfolio(response.data[0])
            } else {
                console.error("Error fetching portfolio:", response.error)
            }
        }
        fetchPortfolio()
    }, [risk])
    return (
        <Box 
        >
            <ActivityChart chartData={chartData} />
            <Box
                display="flex"
                flexDirection="row"
                width="100%"
                justifyContent="space-between"
                justifySelf="center"
                paddingX="4rem"
                marginTop="3rem"
                maxWidth="1500px"
            >
                {/* Portfolio Breakdown content will go here */}
            
            </Box>
        </Box>
    )
}