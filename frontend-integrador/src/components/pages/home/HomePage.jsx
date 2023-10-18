import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  VStack,
  Box,
  HStack,
  Input,
  GridItem,
  SimpleGrid,
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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/products/gallery`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  return (
    <VStack bg={"blackAlpha.900"}>
      <Box h={"200px"} color={"whiteAlpha.700"} p={10}>
        <Input
          color="teal"
          placeholder="custom placeholder"
          _placeholder={{ color: "inherit" }}
        />
        Filter and searchbar
      </Box>
      <SimpleGrid
        columns={{ sm: 1, md: 2 /*,  lg: 4, xl: 5 */}}
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
