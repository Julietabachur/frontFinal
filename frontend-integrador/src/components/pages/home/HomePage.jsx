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



  return (
    <Box w={"99vw"} bg={"blanco"} >
      <VerifiedUser/>
      <VStack >
          <SearchBar />
        <FilterBar />
        <ShowList titulo={''}/>
      </VStack>
    </Box>
  );
};

export default HomePage;
