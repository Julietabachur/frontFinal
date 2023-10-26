import { Box, Button, HStack } from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";

const RenderPagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <HStack spacing="2" mb={4}>
      <Button
        isDisabled={currentPage < 2}
        colorScheme="teal"
        onClick={() => setCurrentPage(1)}
      >
        <ArrowLeftIcon />
      </Button>

      <Button
        isDisabled={currentPage < 2}
        colorScheme="teal"
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <ArrowBackIcon />
      </Button>

      {pageNumbers.map((pageNumber) => (
        <Button
        
          key={pageNumber}
          onClick={() => setCurrentPage(pageNumber)}
          variant={pageNumber === currentPage ? "solid" : "outline"}
        >
          {pageNumber}
        </Button>
      ))}

      <Button
        isDisabled={currentPage === totalPages}
        colorScheme="teal"
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <ArrowForwardIcon />
      </Button>

      <Button
        isDisabled={currentPage === totalPages}
        colorScheme="teal"
        onClick={() => setCurrentPage(totalPages)}
      >
        <ArrowRightIcon />
      </Button>
    </HStack>
  );
};

export default RenderPagination;
