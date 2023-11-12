import { useState, useEffect } from "react";
import { VStack, SimpleGrid, Link } from "@chakra-ui/react";
import {
  useParams,
  useNavigate,
  Link as ReactRouterLink,
} from "react-router-dom";
import ProductCard from "../ProductCard";
import ProductCardContainer from "../ProductCardContainer";
import RenderPagination from "../RenderPagination";
import axios from "axios";

const SearchedList = ({searchedList}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [list, setList] = useState([]);
    const [pageData, setPageData] = useState();
    const token = import.meta.env.VITE_TOKEN;
    const baseUrl = import.meta.env.VITE_SERVER_URL;
  
    console.log(searchedList);
    useEffect(()=>{
      setList(searchedList.content)
      setTotalPages(searchedList.totalPages)
      setCurrentPage(searchedList.currentPage+1)
    },[searchedList])



/*   
    useEffect(() => {
      getProductsByType(categories);
    }, [currentPage]);
  
    useEffect(() => {
      setCurrentPage(1);
    }, [categories]);
  
    useEffect(() => {
      if (pageData) {
        setTotalPages(pageData.last);
      }
    }, [pageData]); */
  
    return (
      <VStack>
        <SimpleGrid
          minH={"100vh"}
          columns={{ sm: 1, md: 2 }}
          padding={20}
          spacing={20}
        >
          {list?.map((item) => (
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
  


export default SearchedList