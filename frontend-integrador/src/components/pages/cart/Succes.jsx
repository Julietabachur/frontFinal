import { Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../home/Global.context';

function Succes() {

  const { updateCarrito, deleteCarrito, setCarrito, carrito, clientId, size, setSize, sale, setSale } =
useProductContext();
const navigate = useNavigate();

  return (
    <VStack
        m={1}
        w={"98vw"}
        display={"flex"}
        justifyContent={"start"}
        px={20}
        pt={4}
        pb={10}

      >
        <Text mx={4} fontWeight="medium" fontFamily={"Roboto"} textAlign={'center'} fontSize={{base:'lg',md:"2xl"}} color={'#e1bc6a'} mt={'20px'}>
                    GRACIAS POR TU COMPRA
                </Text>
      </VStack>
  )
}

export default Succes