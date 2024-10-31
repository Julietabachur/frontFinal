import { VStack, Box } from "@chakra-ui/react";
import FilterBar from "./FilterBar";
import RandomProductSlider from "./RandomProductSlider";

const HomePage = () => {
  return (
    <Box w={"100vw"} bg={"blanco"}>
      <VStack>
        <FilterBar />
        <RandomProductSlider />
      </VStack>
    </Box>
  );
};

export default HomePage;