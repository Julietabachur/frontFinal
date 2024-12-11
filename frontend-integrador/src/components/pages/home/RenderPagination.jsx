import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import { useProductContext } from "./Global.context";
import { useEffect } from "react";
const RenderPagination = () => {
  const { totalPages, currentPage, setCurrentPage } = useProductContext();
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    console.log(currentPage);
  }, [currentPage]);
  return (
    <Flex 
    justifyContent={"center"}
    m={8}
    wrap={"wrap"}
    gap={2}
     >
      <Button 
        isDisabled={currentPage < 2}
        // colorScheme="teal"
        bg="color"
        onClick={() => setCurrentPage(1)}
        size={{ base: "sm", sm: "sm", md: "md" }} // Ajustar tamaño según el tamaño de la pantalla
      >
        <ArrowLeftIcon />
      </Button>

      <Button
        isDisabled={currentPage < 2}
        // colorScheme="teal"
        bg="color"
        onClick={() => setCurrentPage(currentPage - 1)}
        size={{ base: "sm", sm: "sm", md: "md" }} // Ajustar tamaño según el tamaño de la pantalla
      >
        <ArrowBackIcon />
      </Button>

      {pageNumbers?.map((number) => (
        <Button
          key={number}
          onClick={() => setCurrentPage(number)}
          variant={number === currentPage ? "solid" : "outline"}
          bg={number === currentPage ? "color" : "white" }
          size={{ base: "sm", sm: "sm", md: "md" }} // Ajustar tamaño según el tamaño de la pantalla
        >
          {number}
        </Button>
      ))}

      <Button
        isDisabled={currentPage === totalPages}
        // colorScheme="teal"
        bg="color"
        onClick={() => setCurrentPage(currentPage + 1)}
        size={{ base: "sm", sm: "sm", md: "md" }} // Ajustar tamaño según el tamaño de la pantalla
      >
        <ArrowForwardIcon />
      </Button>
      <Button
        isDisabled={currentPage === totalPages}
        // colorScheme="teal"
        bg="color"
        onClick={() => setCurrentPage(totalPages)}
        size={{ base: "sm", sm: "sm", md: "md" }} // Ajustar tamaño según el tamaño de la pantalla
      >
        <ArrowRightIcon />
      </Button>
    </Flex>
  );
};

export default RenderPagination;
