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
import ShowList from "./ShowList";
import FilterBar from "./FilterBar";

const HomePage = () => {
  const token = import.meta.env.VITE_TOKEN;
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
       
        {!media && <FilterBar />}
        <ShowList />
        {/*  {filtered ? (
          <FilteredList categories={categories} setCant={setCant} />
        ) : searched ? (
          <SearchedList handleSearch={handleSearch} searchedList={searchedList} />
        ) : (
          <ProductList setCant={setCant} />
        )} */}
      </VStack>
    </Box>
  );
};

export default HomePage;
