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
import ProductList from "./ProductList";
import FilteredList from "./FilteredList";

const HomePage = () => {
  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [filtered, setFiltered] = useState(false);
  const [media, setMedia] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cant, setCant] = useState(0);
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

  const handleSearch = async () => {
    setFiltered(true);
  };

  //si se cancelan todos los filtros te vuelve a  la lista de mesclados
  useEffect(() => {
    if (categories.length === 0) {
      setFiltered(false);
    }
  }, [categories]);

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
          <Button h={7} color={"blanco"} borderRadius={20} bg={"negro"}>
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
                    w={150}
                    h={150}
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
                bg={"verde1"}
                w={40}
                onClick={() => handleSearch()}
              >
                Filtrar
              </Button>
              <Button
                h={7}
                color={"blanco"}
                bg={"red.400"}
                w={40}
                onClick={() => handleFiltros()}
              >
                Borrar Filtros
              </Button>
              <Text
                color={"verde2"}
                fontSize={{ base: 12, lg: 18 }}
              >{`Cantidad de resultados ${cant}`}</Text>
            </VStack>
          </HStack>
        )}
        {filtered ? (
          <FilteredList categories={categories} setCant={setCant} />
        ) : (
          <ProductList setCant={setCant} />
        )}
      </VStack>
    </Box>
  );
};

export default HomePage;
