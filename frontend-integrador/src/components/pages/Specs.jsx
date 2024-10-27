import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Grid,
  GridItem,
} from "@chakra-ui/react";

function Specs({ detail }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box width="100%" padding={2} h={"100%"} border={"1px solid black"}>
      <Button
        variant="outline"
        fontSize={"0.8rem"}
        onClick={toggleCollapse}
        display={{ base: "block", md: "none" }}
      >
        {isCollapsed ? "Mostrar características" : "Ocultar características"}
      </Button>

      {(!isCollapsed || window.innerWidth >= 768) && (
        <VStack my={5} alignItems="flex-start" >
          <Text as='u' fontFamily="Roboto" marginLeft={4} fontWeight={"medium"} color="black" fontSize={["0.9rem", "1.2rem"]}>
            CARACTERÍSTICAS DEL PRODUCTO
          </Text>
        <Grid
          w={"100%"}
          p={4}
          templateColumns={{
            base: "1fr",
            lg: "repeat(2, 1fr)",
            xl: "repeat(3, 1fr)",
          }}
          gap={5}
        >
          {detail && detail.features && detail.features.length > 0 ? (
            detail.features.map((feature, index) => (
              <GridItem w="100%" colSpan={1}  key={index}>
                <HStack
                  padding={4}
                  border="1px solid green"
                  borderRadius={5}
                >
                  <Text fontFamily="Roboto" color="black" fontSize="1rem">
                    {feature.charIcon}
                  </Text>
                  <Text
                    fontFamily="Roboto"
                    textShadow="1px 1px lightgreen"
                    color="black"
                    fontSize="1rem"
                  >
                    {`${feature.charName}: `}
                  </Text>
                  {feature.charValue.map((value, valueIndex) => (
                    <Text
                      key={valueIndex}
                      fontFamily="Roboto"
                      color="gris1"
                      fontSize="0.9rem"
                    >
                      {value}
                    </Text>
                  ))}
                </HStack>
              </GridItem>
            ))
          ) : (
            <Text fontFamily="Roboto" color="black" fontSize="1rem">
              No hay características disponibles para este producto.
            </Text>
          )}
        </Grid>
        </VStack>
      )}
    </Box>
  );
}

export default Specs;
