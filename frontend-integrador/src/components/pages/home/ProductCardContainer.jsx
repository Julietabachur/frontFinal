import { Box } from "@chakra-ui/react";

const ProductCardContainer = ({ children }) => {
  return (
    <Box p={1} width={'100%'} >
      {children}
    </Box>
  );
};

export default ProductCardContainer;

