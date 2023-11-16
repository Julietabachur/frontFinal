import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Box,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { CancelToken } from "axios";
import { useProductContext } from "../Global.context";
import { color } from "framer-motion";

const SearchBar = () => {
  const {
    startDate,
    endDate,
    productName,
    setProductName,
    setStartDate,
    setEndDate,
    currentPage,
    setPaginatedData,
    searchResults,
    setSearchResults,
  } = useProductContext();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [cancelToken, setCancelToken] = useState(null);

  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/search?`,
        {
          params: {
            productName: productName.toUpperCase(),
            startDate: startDate,
            endDate: endDate || null,
            currentPage,
          },
        }
      );
      if (response) {
        setPaginatedData(response.data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      // Manejar el error en tu aplicación, posiblemente mostrar un mensaje al usuario
    }
  };

  useEffect(() => {
    if (cancelToken) {
      cancelToken.cancel("Request canceled by the user");
    }
    const source = CancelToken.source();
    setCancelToken(source);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/public/products/search`,
          {
            params: {
              productName: productName,
              startDate: startDate,
              endDate: endDate || null,
              currentPage,
            },
            cancelToken: source.token,
          }
        );

        setSearchResults(response.data.content);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        } else {
          console.error("Error during search:", error);
        }
      }
    };
    if (productName) {
      fetchData();
    } else {
      setSearchResults([]);
    }

    // Cleanup function to cancel the request when the component unmounts
    return () => source.cancel("Request canceled by the cleanup function");
  }, [productName, startDate, endDate, currentPage]);

  const handleInput = (productName) => {
    setProductName(productName);
  };

  return (
    <Grid
      top={21}
      position={"relative"}
      w={"100%"}
      h={["250px", "250px", "150px"]}
      templateRows={["repeat(4, 1fr)", "repeat(4, 1fr)", "repeat(3, 1fr)"]}
      templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)", "repeat(7, 1fr)"]}
      bg={"gris1"}
      pb={3}
      color={"blanco"}
    >
      <GridItem
        gridRow={[1, 1, 1]}
        gridColumnStart={[1, 1, 1]}
        gridColumnEnd={[3, 5, 8]}
        px={3}
      >
        <Text textShadow={"dark-lg"} textAlign={"center"} fontSize={24}>
          ¿Que estas buscando?
        </Text>
      </GridItem>
      <GridItem
        gridRow={[2, 2, 2]}
        gridColumnStart={[1, 1, 1]}
        gridColumnEnd={[3, 5]}
        px={2}
      >
        <Popover
          returnFocusOnClose={false}
          isOpen={searchResults && searchResults.length > 1}
          onClose={onClose}
          placement="bottom-start"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Input
              my={2}
              bg={"white"}
              type="text"
              focusBorderColor="lime"
              value={productName}
              variant={"filled"}
              colorScheme="crimson"
              color={"verde1"}
              boxShadow={"dark-lg"}
              placeholder="Escribe aqui el nombre de la prenda que buscas"
              onChange={(e) => setProductName(e.target.value)}
            />
          </PopoverTrigger>
          <PopoverContent minW={"150%"}>
            <PopoverBody>
              <VStack justify={"flex-start"} align={"flex-start"}>
                {searchResults &&
                  searchResults.map((item) => (
                    <Box
                      as={Button}
                      w={"100%"}
                      justifyContent={"flex-start"}
                      bg={"white"}
                      value={item.productName}
                      onClick={(e) => setProductName(e.target.value)}
                      color={"black"}
                      key={item.id}
                      _hover={{
                        backgroundColor: "green.200",
                        cursor: "pointer",
                      }}
                    >
                      {item.productName}
                    </Box>
                  ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </GridItem>
      <GridItem
        pl={2}
        pr={1}
        gridRow={[3, 3, 2]}
        gridColumnStart={[2, 1, 5]}
        gridColumnEnd={[1, 3, 6]}
      >
        <VStack my={2}>
          {/* <Text>Fecha inicial</Text> */}
          <Input
            focusBorderColor="lime"
            type="date"
            color={"verde1"}
            min={startDate}
            value={startDate}
            boxShadow={"dark-lg"}
            variant={"filled"}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </VStack>
      </GridItem>
      <GridItem
        pr={2}
        pl={1}
        gridRow={[3, 3, 2]}
        gridColumnStart={[2, 3, 6]}
        gridColumnEnd={[3, 5, 7]}
      >
        <VStack my={2}>
          {/* <Text>Fecha final</Text> */}
          <Input
            focusBorderColor="lime"
            boxShadow={"dark-lg"}
            color={"verde1"}
            variant={"filled"}
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </VStack>
      </GridItem>
      <GridItem
        pr={0}
        pl={[16, 16, 0]}
        pt={2}
        gridRow={[4, 4, 2]}
        gridColumnStart={[1, 2, 7]}
        gridColumnEnd={[3, 4, 8]}
      >
        <Button colorScheme="green" w={"80%"} onClick={handleSearch}>
          Buscar
        </Button>
      </GridItem>
    </Grid>
  );
};

export default SearchBar;
