"use client";
import { useEffect, useState } from "react";
import { getNews } from "@/app/apis/portfolio";
import { Box, Heading, SimpleGrid, Text, Link, HStack, Image, Skeleton } from "@chakra-ui/react";
import LoadNewsImage from "@/utils/LoadNewsImage";

export default function LatestNews() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await getNews();
                
                if (response.success && response.data) {
                    setNews(response.data.filter(article => article.source !== "MarketWatch" && article.image).slice(0, 10)); 
                } 
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        }
        fetchNews()
    }, []);

    return (
        <Box marginX="2rem" marginTop="4rem" width="100%">
            <Heading
                textStyle="xl"
                fontWeight="semibold"
                className="font-sans"
                color="white"
                marginBottom="2rem"
            >
                Latest News
            </Heading>
            
            {news.length > 0 ? (
                <Box 
                    border="1px solid"
                    borderColor="gray.800"
                    borderRadius="lg"
                    backgroundColor="gray.900/60"
                    backdropFilter="blur(10px)"
                    padding="0.25rem"
                    width="100%"
                >
                    <SimpleGrid columns={2} spacing={6} width="100%">
                        {news.map((article, index) => (
                            <Link
                                key={index}
                                href={article.url}
                                isExternal
                                _hover={{ textDecoration: "none" }}
                                width="100%"
                                focusRing="none"
                            >
                                <Box
                                    borderRadius="md"
                                    padding="0.75rem"
                                    backgroundColor="transparent"
                                    _hover={{
                                        backgroundColor: "gray.800"
                                    }}
                                    transition="all 0.2s"
                                    width="100%"
                                >
                                    <HStack spacing={3} width="100%">
                                        <LoadNewsImage url={article.image} />
                                        <Box flex="1">
                                            <Text
                                                color="white"
                                                fontSize="xs"
                                                fontWeight="medium"
                                                className="font-sans"
                                                lineHeight="1.2"
                                                marginBottom="0.5rem"
                                                _focus={{
                                                    outline: "none",
                                                }}
                                            >
                                                {article.headline || article.title}
                                            </Text>
                                            <Text 
                                                color="gray.400" 
                                                fontSize="2xs" 
                                                fontWeight="medium"
                                            >
                                                {article.source}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                </Box>
            ) : (
                <Skeleton height="400px" width="100%" borderRadius="lg"/>
            )}
        </Box>
    )
}