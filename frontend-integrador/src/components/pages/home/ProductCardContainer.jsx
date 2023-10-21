import { Box } from "@chakra-ui/react";

const ProductCardContainer = ({ children }) => {
  return (
    <Box borderRadius={10} overflow="hidden">
      {children}
    </Box>
  );
};

export default ProductCardContainer;
