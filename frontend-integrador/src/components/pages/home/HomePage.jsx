import { VStack, Box } from "@chakra-ui/react";
import FilterBar from "./FilterBar";
import SearchBar from "./searchBar/SearchBar";
import RandomProductSlider from "./RandomProductSlider";
import ShowList from "./ShowList"; 
import { useProductContext } from "./Global.context"; 
import InfoComponent from "../../infoComponent";
const HomePage = () => {
  const { paginatedData, isFilteredByCategory } = useProductContext(); 

  return (
    <Box w={"97vw"} bg={"blanco"}>
      <VStack spacing={8}>

        {/* FILTRADO POR GRUPOS DE CATEGORIAS */}
        <FilterBar />

        {/* SLIDER DE PRODUCTOS DE TEMPORADA */}
       {/* Mostrar el slider solo si no estamos filtrando por categoría */}
       {!isFilteredByCategory && <RandomProductSlider />}

        {/* PAGINADO DE PRODUCTOS CUANDO SE FILTRA POR CATEGORIA/AS O NOMBRE, Y PARA FAVORITOS */}
        <ShowList products={paginatedData} /> 

        {/* CUADRADOS INFORMATIVOS */}
        <InfoComponent/>

      </VStack>
    </Box>
  );
};

export default HomePage;
