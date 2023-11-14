import { useState, useEffect } from "react";
import axios from "axios";

import { VStack, Box, HStack } from "@chakra-ui/react";

import SearchBar from "./searchBar/SearchBar";
import ShowList from "./ShowList";
import FilterBar from "./FilterBar";
import VerifiedUser from "./VerifiedUser"

const HomePage = () => {
  //const token = import.meta.env.VITE_TOKEN;
  
  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [media, setMedia] = useState(false);
  const MIN_DESKTOP_WIDTH = 600;


  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
      } else {
        setMedia(false);
      }
    };
    window.addEventListener("resize", handleResize);
    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);






  return (
    <Box w={"99vw"} bg={"blanco"} /*p={9}*/>
      <VerifiedUser/>
      <VStack margin={"0px auto"} rowGap={0}>
        {/* buscador */}
        <HStack
          color={"blanco"}
          w={"100%"}
          bg={"#444444"}
          justify={"center"}
          h={"175px"}
          align={"Center"}
          mt={2}
        >
          <SearchBar />
        </HStack>

        {!media && <FilterBar />}
        <ShowList />
      </VStack>
    </Box>
  );
};

export default HomePage;
