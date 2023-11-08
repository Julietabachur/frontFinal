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
  Flex,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";
import FilterBar from "./FilterBar";

const HomePage = () => {
  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [lista, setLista] = useState([]); //products
  const [isLoading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [media, setMedia] = useState(false);
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

  //traer categorias
  useEffect( () => {
    debugger;
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
    setCurrentPage(1);
    setLoading(true);
    const data = await getProductsByType(type);
    if (data) {
      setPageData(data);
      setLista(data.content);
      setLoading(false);
    }
  };

  // const categoriesData = [
  //   {
  //     id: 1,
  //     name: "Remeras",
  //     type: "T_SHIRT",
  //   },
  //   {
  //     id: 2,
  //     name: "Camisas",
  //     type: "SHIRT",
  //   },
  //   {
  //     id: 3,
  //     name: "Pantalones",
  //     type: "PANT",
  //   },
  //   {
  //     id: 4,
  //     name: "Abrigos",
  //     type: "JACKET",
  //   },
  //   {
  //     id: 5,
  //     name: "Accesorios",
  //     type: "ACCESSORY",
  //   },
  // ];

  return (
    <Box w={'99vw'} bg={"blanco"}  /*p={9}*/>
      <VStack margin={"0px auto"} w={'100vw'} rowGap={0}>

        {/* buscador */}
        <HStack
          color={"blanco"}
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
          <Button h={7} color={"blanco"} borderRadius={20} bg={"negro"}>
            Buscar
          </Button>
        </HStack>
        {/* categorias */}
        <HStack w={"100%"} h={{'base':'500px','sm': '250px', 'md':'500px', "lg":'300px'}} bg={"#444444"} display={'flex'} justifyContent={'center'}>     
            <Flex position={'relative'} h={['500px','250px','500px',]}>
              <FilterBar categories={categories} /*getProductsByType={getProductsByType()}*//>
            </Flex>
        </HStack>
      </VStack>
        
          
{/*         
        

        {/* //productos */}
          <VStack>
            <SimpleGrid minH={'100vh'} columns={{ sm: 1, md: 2 }} padding={20} spacing={20}>
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
