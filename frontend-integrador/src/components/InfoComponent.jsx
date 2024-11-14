import React from 'react';
import { FaTruck, FaCreditCard, FaWhatsapp } from 'react-icons/fa';
import { VStack, Icon, SimpleGrid, Text, Box } from "@chakra-ui/react";


const InfoComponent = () => {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={{base: '5', lg: '20'}} p={4}>
  <Box
    borderWidth="1px"
    borderRadius="md"
    p={6}
    textAlign="center"
    boxShadow="sm"
    bg="white"
    width={{ base: '200px', sm: '220px', lg: '250px' }}  // Ajuste similar para este Box
    height={{ base: '200px', sm: '220px', lg: '250px' }} 
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    flexDirection={'column'}
  >
    <Icon as={FaTruck} boxSize={{base:'10', lg:'16'}} mb={2} color="black" />
    <Text fontSize={{base:'sm', lg:"lg"}} fontWeight="semibold">Envíos gratis <br />y en el día <br />dentro de CABA</Text>
  </Box>

  <Box 
    borderWidth="1px" 
    borderRadius="md" 
    p={6} 
    textAlign="center" 
    boxShadow="sm"
    bg="white"
    width={{ base: '200px', sm: '220px', lg: '250px' }}  // Ajuste similar para este Box
    height={{ base: '200px', sm: '220px', lg: '250px' }}  
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    flexDirection={'column'}
  >
    <Icon as={FaCreditCard} boxSize={{base:'10', lg:'16'}} mb={2} color="black" />
    <Text fontSize={{base:'sm', lg:"md"}} fontWeight="semibold">3 cuotas <br />sin interés <br />en todo el sitio</Text>
  </Box>

  <Box 
    borderWidth="1px" 
    borderRadius="md" 
    p={6} 
    textAlign="center" 
    boxShadow="sm"
    bg="white"
    width={{ base: '200px', sm: '220px', lg: '250px' }}  // Ajuste para este último Box también
    height={{ base: '200px', sm: '220px', lg: '250px' }}  
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    flexDirection={'column'}
  >
    <Icon as={FaWhatsapp} boxSize={{base:'10', lg:'16'}} mb={2} color="black" />
    <Text fontSize={{base:'sm', lg:"lg"}} fontWeight="semibold">1134567987 <br />Lu-Sa <br />de 10-17 hs</Text>
  </Box>
</SimpleGrid>

  )
}

export default InfoComponent

