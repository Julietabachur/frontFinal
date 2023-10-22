import { Box } from "@chakra-ui/react";

const ProductCardContainer = ({ children }) => {
  return (
    <Box borderRadius={10} overflow="hidden"  boxShadow={'10px 5px 15px gray'} >
      {children}
    </Box>
  );
};

export default ProductCardContainer;

