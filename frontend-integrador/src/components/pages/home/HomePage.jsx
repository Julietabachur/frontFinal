<<<<<<< HEAD
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
//-
=======
import { VStack, Box } from "@chakra-ui/react";
import SearchBar from "./searchBar/SearchBar";
import ShowList from "./ShowList";
import FilterBar from "./FilterBar";

>>>>>>> da37b2d988761b80070cadace720dc6dcf24b5e2
const HomePage = () => {
  //const token = import.meta.env.VITE_TOKEN;
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const baseUrl = import.meta.env.VITE_SERVER_URL;

<<<<<<< HEAD
  const [lista, setLista] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

    // Limpieza del event listener cuando el componente se desmonta.
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

=======
>>>>>>> da37b2d988761b80070cadace720dc6dcf24b5e2
  return (
    <div>
    <Box w={"99vw"} bg={"blanco"} >
      <VStack >
        <SearchBar />
        <FilterBar />
        <ShowList titulo={''}/>
      </VStack>
    </Box>
    </div>
  );
};

export default HomePage;
