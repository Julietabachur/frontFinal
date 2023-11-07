import { Checkbox, Text, VStack, Button , HStack, Card, CardBody, Image, CardFooter} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import ProductCardContainer from './ProductCardContainer';

const FilterBar = () => {
const token = import.meta.env.VITE_TOKEN;
const baseUrl = import.meta.env.VITE_SERVER_URL;
const [media, setMedia] = useState(false);
const [categories, setCategories] = useState([]);
const [selectedCategories, setSelectedCategories] = useState([]);
const [filteredProductCount, setFilteredProductCount] = useState(0);
const MIN_DESKTOP_WIDTH = 768;

useEffect( () => {
    const urlCategories = `${baseUrl}/api/v1/public/category/all`
      axios
      .get(urlCategories)
      .then((response) => {
        // La respuesta exitosa se encuentra en response.data
        setCategories(response.data)
        console.log('cat:', categories);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
    }
    
,[])

// funcion para agregar categoria a categoriesSelected
const handleCategoryClick = (category) => {
  const index = selectedCategories.indexOf(category);

  if (index === -1) {
    // La categoría no estaba seleccionada, agrégala
    setSelectedCategories([...selectedCategories, category]);
  } else {
    // La categoría ya estaba seleccionada, deseléctala
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories.splice(index, 1);
    setSelectedCategories(newSelectedCategories);
  }

  countFilteredProducts();
};

 // Función para contar la cantidad de productos filtrados
 const countFilteredProducts = () => {
  const filteredCount = selectedCategories.length; // Usa selectedCategories para contar
  setFilteredProductCount(filteredCount);
};

  // Función para limpiar los filtros
  const clearFilters = () => {
    setSelectedCategories([]);
    setFilteredProductCount(0);
  };

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
        console.log('media: ', media);
      } else {
        setMedia(false);
        console.log('media: ', media);
      }
    };   

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (

    <VStack>

        {media ? 
                (
                    <>
                    <HStack justify={"space-around"} w={"100%"} h={'100%'} my={5} display={"flex"} wrap={'wrap'} bg={"#444444"}>
                    {/* //    Muestra las tarjetas de categorías  */}
                    {categories.map((category) => (                    
                        <ProductCardContainer key={category.id} onClick={handleCategoryClick(category)}>
                            <Card  
                            _hover={{
                                transform: "scale(1.02)", // Escala un poco la tarjeta en el hover
                                //boxShadow: "md", // Agrega una sombra al hacer hover
                                cursor: "pointer", // Cambia el cursor al pasar por encima
                                }}
                                border={"5px solid black"}
                                h={'50px'}
                                w={'150px'} 
                                color={"blanco"}
                                alignContent={"center"} justify={"center"} display={"flex"} alignItems={'center'}>                         
                                <CardFooter color={"negro"} alignContent={"center"} justify={"center"} display={"flex"} alignItems={'center'} p={0}>
                                    <Text
                                    fontFamily={"Saira"}
                                    color={"gris1"}
                                    fontSize={'1rem'}
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
                    )
                    )}                   
                    </HStack>
                    <HStack justify={"space-around"} w={"100%"} h={'100%'} my={5} display={"flex"} wrap={'wrap'} bg={"#444444"}>
                    {/* //    Muestra las tarjetas de categorías  */}
                    <Text>Cantidad de productos: {filteredProductCount}</Text>
                    {selectedCategories.map((category) => (                    
                        <Checkbox
                        fontFamily={"Saira"}
                        color={"gris1"}
                        fontSize={'1rem'}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        maxWidth="100%"
                        >
                        {category.categoryName}
                        </Checkbox>
                    )
                    )}                   
                    </HStack>
                    </>
                )
                 : 
                (
                    <HStack justify={"space-around"} w={"100%"} h={'100%'} my={5} display={"flex"} wrap={'wrap'}>
                        {categories.map((category) => (
                        <ProductCardContainer key={category.id} onClick={handleCategoryClick(category)}>
                            <Card  
                            _hover={{
                                transform: "scale(1.02)", // Escala un poco la tarjeta en el hover
                                //boxShadow: "md", // Agrega una sombra al hacer hover
                                cursor: "pointer", // Cambia el cursor al pasar por encima
                                }}
                                border={"5px solid black"}
                                h={['100px','150px',"180px"]}
                                w={['100px','150px',"180px"]} 
                                color={"blanco"}>
                                <CardBody 
                                    border={"1px solid black"}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={'center'}
                                    alignContent={'center'}
                                    h={"99%"}
                                    w={"99%"}
                                    p={0}
                                >
                                    <Image
                                    src={category?.imageUrl}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={'center'}
                                    alignContent={'center'}
                                    h={"100%"}
                                    w={"100%"}
                                    objectFit={"cover"}
                                    ></Image>
                                </CardBody>
                                <CardFooter color={"negro"} alignContent={"center"} justify={"center"}>
                                    <Text
                                    fontFamily={"Saira"}
                                    color={"gris1"}
                                    fontSize={'1 rem'}
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
                        )
                        )}           
                    </HStack>
                )
          }
        </VStack>
      )
    } 
//   );


export default FilterBar;