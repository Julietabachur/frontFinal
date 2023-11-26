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
      <Box width="100%" padding={4} h={"100%"} border={"2px solid black"}>
        <Button
          variant="outline"
          onClick={toggleCollapse}
          display={{ base: "block", md: "none" }}
        >
          {isCollapsed ? "Mostrar políticas del producto" : "Ocultar políticas del producto"}
        </Button>
  
        {(!isCollapsed || window.innerWidth >= 768) && (
            <VStack>
                <Text textAlign={"center"} fontFamily="Saira" fontWeight={"semibold"} color="black" fontSize={["1rem", "1.3rem"]}>
                    POLÍTICAS DE USO DEL PRODUCTO
                </Text>
                <SimpleGrid w={'100%'} h={'100%'} minChildWidth={['150px', '180px']} spacing={2}
                >
                {listPolicies.map((policy) => (
        

                <Box key={policy.id} >
                  <VStack
                  
                    p={3}
                    border="1px solid green"
                    borderRadius={5}
                  >
                    <Text textAlign={"center"} fontFamily="Saira" fontWeight={"medium"} color="green" fontSize="1rem">
                      {policy.policyName}
                    </Text>
                    <Text
                      fontFamily="Podkova"
                      color="black"
                      fontWeight={"thin"}
                      fontSize="0.8rem"
                      textAlign={"center"}
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