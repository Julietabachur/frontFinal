import { useState, useEffect } from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  VStack,
  Box,
  HStack,
  Input,
  SimpleGrid,
  Image,
  Text,
  Button,
  Center,
  Link
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";

const HomePage = () => {
  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [lista, setLista] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null)
  const Skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/public/products/random`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setLista(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchProductsData = async () => {
      const data = await getProducts();
      if (data) {
        console.log(data);
        setLista(data);
      }
    };
    fetchProductsData();
  }, []);

  const getProductsByType = async (type) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/byType/${type}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryClick = async (type) => {
    setLoading(true);
    const data = await getProductsByType(type);
    if (data) {
      setPageData(data)
      setLista(data.content);
    }
    setLoading(false);
  };

  const categoriesData = [
    {
      id: 1,
      name: "Remeras",
      type: "T_SHIRT",
      imageSrc:
        "https://images.hugoboss.com/is/image/boss/hbeu50502323_983_100?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1685549068000&wid=1200&hei=1818",
    },
    {
      id: 2,
      name: "Camisas",
      type: "SHIRT",
      imageSrc:
        "data:image/jpeg;base64,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",
    },
    {
      id: 3,
      name: "Pantalones",
      type: "PANT",
      imageSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTA32zPx0fcycZuIxN_7_XaOoEXFEn8xOgpw&usqp=CAU",
    },
    {
      id: 4,
      name: "Abrigos",
      type: "JACKET",
      imageSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0sPITbCRoSjdOfkj6lHADCA4a69eywtSDdw&usqp=CAU",
    },
    {
      id: 4,
      name: "Accesorios",
      type: "ACCESSORY",
      imageSrc:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0sPITbCRoSjdOfkj6lHADCA4a69eywtSDdw&usqp=CAU",
    },
  ];

  return (
    <Box w={"100vw"} bg={"blanco"} mt={9}>
      <VStack  /* w={"70vw"}  */margin={"0px auto"}>
        <HStack
          color={"negro"}
          w={"100%"}
          bg="blanco"
          justify={"center"}
          h={"75px"}
          align={'Center'}
        >
          <Text fontSize={"1.5rem"}>¿Que buscás?</Text>
          <Input
            bg={"gris2"}
            w={"30%"}
            h={7}
            placeholder="Buscar productos"
            _placeholder={{ color: "inherit" }}
            borderRadius={"15px"}
            m={10}
          />
          <Button h={7} color={"blanco"} borderRadius={20} bg={"negro"}>
            Buscar
          </Button>
        </HStack>

        <HStack justify={"space-around"} h={35} w={"100%"} bg={'negro'} >
          {/* Muestra las tarjetas de categorías */}
          {categoriesData.map((category) => (
            <Box
              key={category.id}
              textAlign="center"
              onClick={() => handleCategoryClick(category.type)}
            >
              {" "}
              <Link fontFamily={'podkova'} color={'verde2'} fontSize={17} p={3}>
                {category.name}
              </Link>
            </Box>
          ))}
        </HStack>
   
        <SimpleGrid columns={{ sm: 1, md: 2 }} padding={20} spacing={40}>
          {isLoading &&
            Skeletons.map((Skeleton) => {
              return (
                <ProductCardContainer key={Skeleton}>
                  <ProductCardSkeleton />
                </ProductCardContainer>
              );
            })}
          {lista.map((item) => (
            <ProductCardContainer key={item.id}>
              <ProductCard item={item} />
            </ProductCardContainer>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default HomePage;
