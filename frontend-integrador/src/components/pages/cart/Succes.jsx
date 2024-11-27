import { Text, VStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react' // Asegúrate de importar useState y useEffect

import PaymentLoading from './PaymentLoading'

function Succes() {
  const [loading, setLoading] = useState(true); // Estado de loading

 
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); 
    }, 7000); 
  }, []); 

  return (
    <>
      {loading ? (
        // Pantalla de carga (loading)
        <PaymentLoading />
      ) : (
        // Contenido después de la carga
        <VStack
          m={1}
          w={"98vw"}
          display={"flex"}
          justifyContent={"start"}
          px={20}
          pt={4}
          pb={10}
        >
          <Text mx={4} fontWeight="medium" fontFamily={"Roboto"} textAlign={'center'} fontSize={{ base: 'lg', md: "2xl" }} color={'#e1bc6a'} mt={'20px'}>
            GRACIAS POR TU COMPRA
          </Text>
        </VStack>
      )}
    </>
  );
}

export default Succes;
