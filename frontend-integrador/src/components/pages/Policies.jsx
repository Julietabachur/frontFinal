import { Box, Button, Grid, GridItem, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const Policies = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [listPolicies, setListPolicies] = useState ([]);
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [colum, setColum] = useState(0);

    // LOGICA DE getPolicyAll- LISTAR todas las politicas sin paginacion para usarlas en el select de productForm y EditProduct
  //no se precisa el token porque es publico
  const getPolicyAll = async () => {
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de productos
        `${baseUrl}/api/v1/public/policy/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
        setListPolicies(response.data);
        setColum(listPolicies.length)
        console.log(listPolicies);
        console.log(colum)
        //console.log("Datos recibidos:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPolicyAll();
}, []);


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
          {isCollapsed ? "Mostrar políticas del producto" : "Ocultar políticas del producto"}
        </Button>
  
        {(!isCollapsed || window.innerWidth >= 768) && (
            <VStack my={5} alignItems="flex-start">
                <Text as='u' marginLeft={4} textAlign={"center"} fontFamily="Roboto" fontWeight={"medium"} color="black" fontSize={["0.9rem", "1.2rem"]}>
                    POLÍTICAS DE USO DEL PRODUCTO
                    
                </Text>
                <SimpleGrid w={'100%'} h={'100%'}  minChildWidth={['350px', "220px", '150px']} spacing={3}
                >
                {listPolicies.map((policy) => (
        
                <Box  key={policy.id} >
                  <VStack
                    h={"100%"}
                    p={4}
                    alignItems="flex-start"
                    key={policy.id}
                  >
                    <Text  fontFamily="Roboto" fontWeight={"medium"} color="green" fontSize="1rem">
                      {policy.policyName}
                    </Text>
                    <Text
                      fontFamily="Roboto"
                      color="black"
                      fontWeight={500}
                      fontSize="0.8rem"
                    >
                      {policy.description}
                    </Text>
                    
                  </VStack>
                </Box>
                
              ))
            }
          </SimpleGrid>
            </VStack>
        
            
          
        )}
      </Box>
    );
}

export default Policies