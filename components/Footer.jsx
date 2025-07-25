import { Box, Text, Center } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      as="footer"
      position="sticky"
      bottom="0"
      left="0"
      width="100%"
      py={4}
      borderTop="1px solid"
      borderColor="gray.800"
      bg="blue.950"
      zIndex="100"
    >
      <Center>
        <Text fontSize="sm" color="gray.500">
          {new Date().getFullYear()} PortfoliOmatic. Created by Thejus & Samuel.
        </Text>
      </Center>
    </Box>
  );
}