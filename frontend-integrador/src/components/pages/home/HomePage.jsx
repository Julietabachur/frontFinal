import { VStack, Box } from "@chakra-ui/react";
import SearchBar from "./searchBar/SearchBar";
import ShowList from "./ShowList";
import FilterBar from "./FilterBar";

const HomePage = () => {

  return (
    <div>
    <Box w={"99vw"} bg={"blanco"} >
      <VStack >
        <SearchBar />
        <FilterBar />
        <ShowList />
      </VStack>
    </Box>
    </div>
  );
};

export default HomePage;
