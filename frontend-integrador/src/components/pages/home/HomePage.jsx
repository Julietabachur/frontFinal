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
import ProductList from "./ProductList";
import FilteredList from "./FilteredList";
import SearchedList from "./searchBar/SearchedList";
import SearchBar from "./searchBar/SearchBar";
import VerifiedUser from "./VerifiedUser";

const HomePage = () => {
  //const token = import.meta.env.VITE_TOKEN;
  
  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [filtered, setFiltered] = useState(false);
  const [media, setMedia] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cant, setCant] = useState(0);
  const [searchedList, setSearchedList] = useState({});
  const [searched, setSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const MIN_DESKTOP_WIDTH = 600;

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/search?`,
        {
          params: {
            productName: productName.toUpperCase(),
            startDate: startDate,
            endDate: endDate || null,
            page,
            size,
          },
        }
      );
      if (response) {
        setSearchedList(response.data);
        setSearched(true);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      // Manejar el error en tu aplicación, posiblemente mostrar un mensaje al usuario
    }
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
    window.addEventListener("resize", handleResize);
    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleCategoryClick = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    } else {
      let updatedCategories = categories.filter((item) => item !== category);
      setCategories(updatedCategories);
    }
  };

  const handleFiltros = () => {
    setCategories([]);
    setFiltered(false);
  };

  const handleFilterSearch = async () => {
    setFiltered(true);
    setSearched(false);
  };

  //si se cancelan todos los filtros te vuelve a  la lista de mesclados
  useEffect(() => {
    if (categories.length === 0) {
      setFiltered(false);
    }
  }, [categories]);

  useEffect(() => {
    if (searchedList?.content?.length === 0) {
      setSearched(false);
    } else {
      setFiltered(false);
      setCategories([]);
    }
  }, [searchedList]);

  return (
    <Box w={"99vw"} bg={"blanco"} /*p={9}*/>
      <VerifiedUser/>
      <VStack margin={"0px auto"} rowGap={0}>
        {/* buscador */}
        <HStack
          color={"blanco"}
          w={"100%"}
          bg={"#444444"}
          justify={"center"}
          h={"175px"}
          align={"Center"}
          /*p={9}*/
          mt={2}
        >
          <SearchBar
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            setSearchedList={setSearchedList}
            setSearched={setSearched}
          />
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
              <VStack w={"30%"} ml={10}>
                <Button
                  h={7}
                  color={"blanco"}
                  bg={"verde2"}
                  w={{ base: "100px", lg: 40 }}
                  onClick={() => handleFilterSearch()}
                  ml={4}
                >
                  Filtrar
                </Button>
                <Button
                  h={7}
                  color={"blanco"}
                  bg={"red.400"}
                  w={{ base: "100px", lg: 40 }}
                  onClick={() => handleFiltros()}
                  ml={4}
                >
                  Borrar Filtros
                </Button>
                <Text
                  color={"verde2"}
                  fontSize={{ base: 12, lg: 18 }}
                  w={"80px"}
                >{`Estás viendo ${cant} productos`}</Text>
              </VStack>
              {categoryList.map((category) => (
                <MenuItem
                  bg={"negro"}
                  key={category.id}
                  textAlign="center"
                  onClick={() => handleCategoryClick(category.categoryName)}
                >
                  <Box
                    bg={"verde2"}
                    py={1}
                    px={2}
                    ml={5}
                    style={{
                      border: categories.includes(category.categoryName)
                        ? "3px solid #e2e8f0"
                        : "none",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: categories.includes(category.categoryName)
                          ? "bold"
                          : "normal",
                        color: categories.includes(category.categoryName)
                          ? "#e2e8f0"
                          : "black",
                      }}
                    >
                      {category.categoryName}
                    </Text>
                  </Box>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
        {!media && (
          <HStack
            justify={"space-around"}
            w={"100%"}
            bg={"negro"}
            pr={"40px"}
            pt={2}
            pb={2}
          >
            {/* Muestra las tarjetas de categorías */}
            {categoryList.map((category) => (
              <Box
                key={category.id}
                textAlign="center"
                onClick={() => handleCategoryClick(category.categoryName)}
                style={{
                  border: categories.includes(category.categoryName)
                    ? "3px solid #00cc00"
                    : "none",
                }}
              >
                <Box bg={"verde2"}>
                  <Image
                    w={{ base: 100, lg: 150 }}
                    h={{ base: 100, lg: 150 }}
                    objectFit={"cover"}
                    src={category.imageUrl}
                    fallbackSrc="https://via.placeholder.com/150"
                  />
                  <Text color={"negro"}>{category.categoryName}</Text>
                </Box>
              </Box>
            ))}
            <VStack w={"20%"} pl={10}>
              <Button
                h={7}
                color={"blanco"}
                bg={"verde2"}
                w={{ base: "100px", lg: 40 }}
                onClick={() => handleFilterSearch()}
              >
                Filtrar
              </Button>
              <Button
                h={7}
                color={"blanco"}
                bg={"red.400"}
                w={{ base: "100px", lg: 40 }}
                onClick={() => handleFiltros()}
              >
                Borrar Filtros
              </Button>
              <Text
                color={"verde2"}
                fontSize={{ base: 12, lg: 18 }}
              >{`Estás viendo ${cant} productos`}</Text>
            </VStack>
          </HStack>
        )}
        {filtered ? (
          <FilteredList categories={categories} setCant={setCant} />
        ) : searched ? (
          <SearchedList handleSearch={handleSearch} searchedList={searchedList} />
        ) : (
          <ProductList setCant={setCant} />
        )}
      </VStack>
    </Box>
  );
};

export default HomePage;
