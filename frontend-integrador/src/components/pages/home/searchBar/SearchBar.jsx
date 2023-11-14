import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  HStack,
  Input,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { CancelToken } from "axios";
import { useProductContext } from "../Global.context";

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
          return
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
    <HStack w={"70%"} align="flex-start">
      <Text>Buscador</Text>
      <Popover
        returnFocusOnClose={false}
        isOpen={searchResults && searchResults.length > 0}
        onClose={onClose}
        placement="bottom-start"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Input
            type="text"
            value={productName}
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
                    _hover={{ backgroundColor: "green.200", cursor: "pointer" }}
                  >
                    {item.productName}
                  </Box>
                ))}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Input
        w={"30%"}
        placeholder="Select Date and Time"
        size="md"
        type="date"
        min={startDate}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        w={"30%"}
        size="md"
        type="date"
        onChange={(e) => setEndDate(e.target.value)}
      />
      <Button onClick={handleSearch}>Buscar</Button>
    </HStack>
  );
};

export default SearchBar;
