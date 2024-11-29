import { Box, Text, VStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react' // Asegúrate de importar useState y useEffect

import PaymentLoading from './PaymentLoading'
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../home/Global.context';

function Succes() {

  const {sale} = useProductContext();
const navigate = useNavigate();

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
          <Box>
            <Text>Compraste:
              {sale?.productList?.map((product)=>{
                <Text>{product.productName} - Cantidad: {product.amount} - Talle {product.size} - {product.price}</Text>
              })}
            </Text>
            <Text>Total abonado: ${sale.totalPrice}</Text>
            <Text>Entrega: {sale.entrega}</Text>
            <Text>Medio de pago: {sale.medioDePago}</Text>
          </Box>
        </VStack>
      )}
    </>
  );
}

export default Succes;
