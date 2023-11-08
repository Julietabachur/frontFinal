import { useState, useEffect } from "react";
import { VStack, SimpleGrid, Link } from "@chakra-ui/react";
import {
  useParams,
  useNavigate,
  Link as ReactRouterLink,
} from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";
import axios from "axios";

const ProductList = ({setCant}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);
  const [pageData, setPageData] = useState();

  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

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
        setList(shuffleArray(response.data.content));
        setCant(response.data.totalElements)
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProductsData = async () => {
    const data = await getProducts();
    if (data) {
      console.log(data.content);
      setList(data.content);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [currentPage]);

  useEffect(() => {
    if (pageData) {
      setTotalPages(pageData.last);
    }
  }, [pageData]);

  return (
    <VStack>
      <SimpleGrid
        minH={"100vh"}
        columns={{ sm: 1, md: 2 }}
        padding={20}
        spacing={20}
      >
        {list.map((item) => (
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
  );
};

export default ProductList;
