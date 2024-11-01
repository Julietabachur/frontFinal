import React from "react";
import { VStack, Icon, SimpleGrid, Box, Text } from "@chakra-ui/react";
import { FaTruck, FaCreditCard, FaWhatsapp } from "react-icons/fa";

const ShowList = () => {
  return (
    <VStack>
      {/* Solo los íconos de servicios */}
      <SimpleGrid columns={[1, 1, 3]} spacing={28} p={4}>
        <Box
          borderWidth="1px"
          borderRadius="md"
          p={6}
          textAlign="center"
          boxShadow="sm"
          bg="white"
          width="250px"
          height="250px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Icon as={FaTruck} boxSize={16} mb={2} color="black" />
          <Text fontSize="lg" fontWeight="semibold">
            Envíos gratis <br />y en el día <br />dentro de CABA
          </Text>
        </Box>

        <Box
          borderWidth="1px"
          borderRadius="md"
          p={6}
          textAlign="center"
          boxShadow="sm"
          bg="white"
          width="250px"
          height="250px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Icon as={FaCreditCard} boxSize={16} mb={2} color="black" />
          <Text fontSize="lg" fontWeight="semibold">
            3 cuotas <br />sin interés <br />en todo el sitio
          </Text>
        </Box>

        <Box
          borderWidth="1px"
          borderRadius="md"
          p={6}
          textAlign="center"
          boxShadow="sm"
          bg="white"
          width="250px"
          height="250px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Icon as={FaWhatsapp} boxSize={16} mb={2} color="black" />
          <Text fontSize="lg" fontWeight="semibold">
            Contáctanos: <br />1134567987 <br />lu-sa de 10-17 hs
          </Text>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default ShowList;
