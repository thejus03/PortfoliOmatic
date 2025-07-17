import { useState } from "react";
import { Image, Skeleton } from "@chakra-ui/react";

export default function LoadNewsImage({ url }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <>
            <Image
                src={url || null}
                alt="News"
                width="60px"
                height="60px"
                objectFit="cover"
                borderRadius="md"
                onLoad={() => setIsLoaded(true)}
                display={isLoaded ? "block" : "none"}
            />
        {!isLoaded && (
            <Skeleton
                width="60px"
                height="60px"
                borderRadius="md"
            />
        )}
        </>
    )
}