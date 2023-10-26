import { useState, useEffect } from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import axios from "axios";
import {
  useParams,
  useNavigate,
  Link as ReactRouterLink,
} from "react-router-dom";
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
  Link,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";

const HomePage = () => {
  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [lista, setLista] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const Skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/public/products?page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          setPageData(response.data);
          setLista(response.data.content);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchProductsData = async () => {
      const data = await getProducts();
      if (data) {
        console.log(data.content);
        setLista(data.content);
      }
    };
    fetchProductsData();
  }, [currentPage]);

  const getProductsByType = async (type) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/byType?type=${type}&page=${currentPage}`,
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

  useEffect(() => {
    if (pageData) {
      setTotalPages(pageData.last);
    }
  }, [pageData]);

  const handleCategoryClick = async (type) => {
    setCurrentPage(1)
    setLoading(true);
    const data = await getProductsByType(type);
    if (data) {
      setPageData(data);
      setLista(data.content);
      setLoading(false);
    }
  };

  const categoriesData = [
    {
      id: 1,
      name: "Remeras",
      type: "T_SHIRT",
    },
    {
      id: 2,
      name: "Camisas",
      type: "SHIRT",
    },
    {
      id: 3,
      name: "Pantalones",
      type: "PANT",
    },
    {
      id: 4,
      name: "Abrigos",
      type: "JACKET",
    },
    {
      id: 5,
      name: "Accesorios",
      type: "ACCESSORY",
    },
  ];

  return (
    <Box w={"100vw"} bg={"blanco"} /*p={9}*/>
      <VStack /* w={"70vw"}  */ margin={"0px auto"} rowGap={0}>
        {/* buscador */}
        <HStack
          color={"negro"}
          w={"100%"}
          bg={"#444444"}
          justify={"center"}
          h={"75px"}
          align={"Center"}
          /*p={9}*/
          mt={2}
        >
          <Text fontSize={"1.5rem"}>¿Que buscás?</Text>
          <Input
            bg={"blanco"}
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

        {/* categorias */}
        <HStack justify={"space-around"} h={35} w={"100%"} bg={"negro"}>
          {/* Muestra las tarjetas de categorías */}
          {categoriesData.map((category) => (
            <Box
              key={category.id}
              textAlign="center"
              onClick={() => handleCategoryClick(category.type)}
            >
              {" "}
              <Link fontFamily={"podkova"} color={"verde2"} fontSize={17} p={3}>
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
            <Link key={item.id} as={ReactRouterLink} to={`/detalle/${item.id}`}>
              <ProductCardContainer key={item.id}>
                <ProductCard item={item} />
              </ProductCardContainer>
            </Link>
          ))}
        </SimpleGrid>
        {pageData && (
          <RenderPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </VStack>
    </Box>
  );
};

export default HomePage;
