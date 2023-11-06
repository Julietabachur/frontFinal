import { Checkbox, Text, VStack, Button , HStack} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";

const FilterBar = () => {
const token = import.meta.env.VITE_TOKEN;
const baseUrl = import.meta.env.VITE_SERVER_URL;
const [media, setMedia] = useState(false);
const [categories, setCategories] = useState([]);
const [filteredProductCount, setFilteredProductCount] = useState(0);
const MIN_DESKTOP_WIDTH = 768;

useEffect( () => {
        axios.get(`${baseUrl}/api/v1/public/category/all`)
      .then((response) => {
        debugger;
        // La respuesta exitosa se encuentra en response.data
        setCategories(response)
        console.log('Categorías:', categories);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
    }
    
,[])


  // Función para contar la cantidad de productos filtrados
  const countFilteredProducts = () => {
    const filteredCount = categories.filter((category) => category.isChecked).length;
    setFilteredProductCount(filteredCount);
  };

  // Función para limpiar los filtros
  const clearFilters = () => {
    categories.forEach((category) => {
      category.isChecked = false;
    });
    setFilteredProductCount(0);
  };

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
      } else {
        setMedia(false);
      }
    };

    if (window.innerWidth < MIN_DESKTOP_WIDTH) {
      setMedia(true);
    } else {
      setMedia(false);
    }

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    // <VStack align="start" justifyContent="start" bg="black" w="200px" p={4} h={"100vh"}>
    //   <Text fontSize="md" color="verde2">
    //     Mostrando {filteredProductCount} de {categories.length} productos.
    //   </Text>

    //   {categories.map((category) => (
    //     <Checkbox
    //       key={category.id}
    //       size="md"
    //       isChecked={category.isChecked}
    //       onChange={() => {
    //         category.isChecked = !category.isChecked;
    //         countFilteredProducts();
    //       }}
    //     >
    //       <Text fontSize="md" color="verde2">
    //         {category.name}
    //       </Text>
    //     </Checkbox>
    //   ))}

    //   <Button
    //     size="md"
    //     colorScheme="red" // Puedes elegir el color que desees
    //     onClick={clearFilters}
    //     mt={4} // Margen superior para separar el botón de los checkboxes
    //   >
    //     Limpiar Filtro
    //   </Button>
    // </VStack>
 
    // {!media &&
    //     (
        <HStack justify={"space-around"} h={35} w={"100%"} bg={"negro"}>


        //    Muestra las tarjetas de categorías 
          {categories.map((category) => (
            <ProductCardContainer key={category.id}>
                   <Card  
                      h={['350px','300px', "300px"]}
                      w={['300px','300px',"300px"]} 
                      color={"blanco"}>
                        <CardBody
                            _hover={{
                            transform: "scale(1.02)", // Escala un poco la tarjeta en el hover
                            boxShadow: "md", // Agrega una sombra al hacer hover
                            cursor: "pointer", // Cambia el cursor al pasar por encima
                            }}
                            border={"5px solid black"}
                            boxShadow={"5px 5px 5px gray"}
                            display={"flex"}
                            justifyContent={"center"}
                            h={['100%']}
                            w={['100%']}
                            p={0}
                        >
                            <Image
                            src={category?.imageUrl}
                            h={"100%"}
                            w={"100%"}
                            objectFit={"cover"}
                            ></Image>
                        </CardBody>
                        <CardFooter color={"negro"} alignContent={"center"} justify={"center"}>
                            <Text
                            fontFamily={"Saira"}
                            color={"gris1"}
                            fontSize={['1 rem', '1.2rem']}
                            textShadow={"5px 5px 5px gray"}
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="100%"
                            >
                            {category.categoryName}
                            </Text>
                        </CardFooter>
                    </Card>
            </ProductCardContainer>
          ))}
        </HStack>
    //   )} 
  );
}

export default FilterBar;