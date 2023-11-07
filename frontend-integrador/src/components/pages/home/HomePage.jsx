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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [media, setMedia] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const Skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const MIN_DESKTOP_WIDTH = 600;

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
      } else {
        setMedia(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setLoading(true);

    const getProducts = async () => {
      try {
        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };

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
          setLista(shuffleArray(response.data.content));
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

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/public/category/all`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          setCategoryList(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
  }, []);

  const handleCategoryClick = (category) => {;
    if(!categories.includes(category)){
      setCategories([...categories, category]);
    }else{
      return
    }
    
  };

  const getProductsByType = async (categories) => {

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/category?categories=${categories}&page=${currentPage}`,
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

  const handleSearch = async () => {
    setCurrentPage(1);
    setLoading(true);
    const data = await getProductsByType(categories);
    if (data) {
      setPageData(data);
      setLista(data.content);
      setLoading(false);
    }
  };

  return (
    <Box w={"99vw"} bg={"blanco"} /*p={9}*/>
      <VStack margin={"0px auto"} rowGap={0}>
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
          {!media && <Text fontSize={"1.5rem"}>¿Que buscás?</Text>}
          <Input
            bg={"blanco"}
            w={media ? "50%" : "30%"}
            h={7}
            placeholder="Buscar productos"
            _placeholder={{ color: "inherit" }}
            borderRadius={"15px"}
            m={10}
          />
          <Button h={7} color={"blanco"} borderRadius={20} bg={"negro"} onClick={()=> handleSearch()}>
            Buscar
          </Button>
        </HStack>

        {/* categorias */}
        {media && (
          <Menu>
            <MenuButton minW={"99vh"} bg={"negro"}>
              <Text fontFamily={"podkova"} color={"verde2"} fontSize={17} p={3}>
                Categorias
              </Text>
            </MenuButton>
            <MenuList bg={"negro"}>
              {categoryList.map((category) => (
                <MenuItem
                  bg={"negro"}
                  key={category.id}
                  textAlign="center"
                  onClick={() => handleCategoryClick(category.categoryName)}
                >
                    <Box bg={"yellow"}>
                      <Image
                        src={category.imageUrl}
                        fallbackSrc="https://via.placeholder.com/150"
                      />
                      <Text color={"green"}>{category.categoryName}</Text>
                    </Box>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
        {!media && (
          <HStack justify={"space-around"} h={200} w={"100%"} bg={"negro"}>
            {/* Muestra las tarjetas de categorías */}
            {categoryList.map((category) => (
              <Box
                key={category.id}
                textAlign="center"
                onClick={() => handleCategoryClick(category.categoryName)}
              >
              
                  <Box bg={"verde2"}>
                    <Image
                      src={category.imageUrl}
                      fallbackSrc="https://via.placeholder.com/150"
                    />
                    <Text color={"negro"}>{category.categoryName}</Text>
                  </Box>
              </Box>
            ))}
          </HStack>
        )}

        <SimpleGrid
          minH={"100vh"}
          columns={{ sm: 1, md: 2 }}
          padding={20}
          spacing={20}
        >
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
