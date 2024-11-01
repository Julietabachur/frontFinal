import { VStack, Box } from "@chakra-ui/react";
import FilterBar from "./FilterBar";
import SearchBar from "./searchBar/SearchBar";
import RandomProductSlider from "./RandomProductSlider";
import ShowList from "./ShowList"; 
import { useProductContext } from "./Global.context"; 
const HomePage = () => {
  const { paginatedData } = useProductContext(); 

  return (
    <Box w={"100vw"} bg={"blanco"}>
      <VStack spacing={8}>
        <FilterBar />
        <RandomProductSlider />
        <ShowList products={paginatedData} /> 
      </VStack>
    </Box>
  );
};

export default HomePage;
