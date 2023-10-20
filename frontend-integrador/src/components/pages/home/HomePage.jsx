import { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";

const HomePage = () => {
  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [lista, setLista] = useState([]);
  const [user, setUser] = useState({});
  const { username } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const Skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  /*   const getProductsByType = async (type) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/products/byType/${type}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryClick = async (type) => {
    setLoading(true);
    const data = await getProductsByType(type);
    if (data) {
      setLista(data);
    }
    setLoading(false);
  }; */

  /* useEffect(() => {
    const getUserData = async (username) => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/clients/search?username=${username}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 403) {
          navigate("/login");
        }
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUserData = async () => {
      const data = await getUserData(username);
      if (data) {
        setUser(data);
      }
    };

    fetchUserData();
  }, []); */

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/public/products`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data) {
          setLista(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
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

  const categoriesData = [
    {
      id: 1,
      name: "Categoría 1",
      imageSrc: "imagen_categoria_1.jpg",
    },
    {
      id: 2,
      name: "Categoría 2",
      imageSrc: "imagen_categoria_2.jpg",
    },
    {
      id: 3,
      name: "Categoría 3",
      imageSrc: "imagen_categoria_3.jpg",
    },
    {
      id: 4,
      name: "Categoría 4",
      imageSrc: "imagen_categoria_4.jpg",
    },
  ];

  return (
    <VStack bg={"brandColor"} p={3} w={"70vw"} margin={"88px auto"}>
      <HStack
        color={"blackAlpha.900"}
        w={"100%"}
        bg="#34C412"
        justify={"center"}
      >
        <Text fontSize={"1.5rem"}>Que Buscas?</Text>
        <Input
          w={"50%"}
          bg={"whiteAlpha.900"}
          placeholder="Buscar productos"
          _placeholder={{ color: "inherit" }}
          borderRadius={"15px"}
          m={10}
        />
        <Button
          p={"10px 40px"}
          color={"#34C412"}
          borderRadius={20}
          bg={"blackAlpha.900"}
        >
          Buscar
        </Button>
      </HStack>
      <VStack w={"100%"}>
        <Box w={"100%"} bg={"green"} alignSelf={"flex-start"}>
          <Text fontSize={26} p={3}>
            Categorias
          </Text>
        </Box>

        <HStack
          p={4}
          spacing={4}
          bg={"green.500"}
          w={"100%"}
          justify={"Center"}
        >
          {/* Muestra las tarjetas de categorías */}
          {categoriesData.map((category) => (
            <Box
              key={category.id}
              textAlign="center"
              onClick={() => handleCategoryClick(category.type)}
            >
              <Image
                src={category.imageSrc}
                fallbackSrc="https://via.placeholder.com/600"
                alt={category.name}
                w="20vw"
              />
              <Text>{category.name}</Text>
            </Box>
          ))}
        </HStack>
      </VStack>

      <SimpleGrid
        columns={{ sm: 1, md: 2 /*,  lg: 4, xl: 5 */ }}
        padding={1}
        spacing={3}
      >
        {isLoading &&
          Skeletons.map((Skeleton) => {
            return (
              <ProductCardContainer key={Skeleton}>
                <ProductCard />
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
  );
};

export default HomePage;
