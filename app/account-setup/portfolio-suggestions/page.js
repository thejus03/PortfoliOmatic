import { Stack, Box, Heading, Text } from "@chakra-ui/react"
import { Space_Grotesk } from "next/font/google"
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["600"],
  });
function page() {

    return (
        <Stack direction="column" align="center" justify="center" gap="10">
            <Box className="mt-16">
                <Heading textStyle="2xl" color="blue.200" fontWeight="bold" fontFamily={spaceGrotesk.style.fontFamily}>Great! We've got some portfolio suggestions for you.</Heading>
            </Box>
            <Box className="mt-16">

            </Box>
        </Stack>
    )
}

export default page