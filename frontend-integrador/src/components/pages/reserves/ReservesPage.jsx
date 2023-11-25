import React from "react";
import SearchBar from "../home/searchBar/SearchBar";
import {
  Text,
  VStack,
  SimpleGrid,
  Box,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useProductContext } from "../home/Global.context";
import RenderPagination from "../home/RenderPagination";
import { Navigate, useNavigate } from "react-router-dom";

const ReservesPage = () => {
  const { paginatedData } = useProductContext();
  const navigate = useNavigate();

  return (
    <VStack w={"100%"}>
      <Text
        fontFamily={"Saira"}
        color={"black"}
        fontSize={"2.5rem"}
        w={"100%"}
        textAlign={"center"}
      >
        Reservas
      </Text>
      <SearchBar />
      <SimpleGrid w={"100%"} spacing={4} minChildWidth="300px">
        {paginatedData.map((product) => (
          <VStack key={product.id} borderRadius={6} boxShadow={"2xl"} p={3}>
            <Image
              boxSize={"sm"}
              src={product.thumbnail}
              alt="imagen"
              objectFit={"cover"}
            />

            <HStack>
              <Button
                bg={"verde2"}
                onClick={() => {
                  navigate(`/detalle/${product.id}`);
                }}
              >
                Detalle
              </Button>
              <Button bg={"verde2"}>Reservar</Button>
            </HStack>
          </VStack>
        ))}
      </SimpleGrid>
      <RenderPagination />
    </VStack>
  );
};

export default ReservesPage;
