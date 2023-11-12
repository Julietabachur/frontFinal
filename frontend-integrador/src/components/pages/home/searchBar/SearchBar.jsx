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
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  VStack,
  Box,
  useDisclosure,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { CancelToken } from "axios";

const SearchBar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [productName, setProductName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchResults, setSearchResults] = useState([]);
  const [cancelToken, setCancelToken] = useState(null);

  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  // Función para asegurarse de que no puedan elegir menos que la fecha actual
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Setea la fecha inicial en la del día
  useEffect(() => {
    setStartDate(getCurrentDate());
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/search?`,
        {
          params: {
            productName: productName.toUpperCase(),
            startDate: startDate,
            endDate: endDate || null,
            page,
            size,
          },
        }
      );
      if (response) {
        setSearchResults(response.data.content);
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
              productName: productName.toUpperCase(),
              startDate: startDate,
              endDate: endDate || null,
              page,
              size,
            },
            cancelToken: source.token,
          }
        );

        setSearchResults(response.data.content);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error during search:", error);
        }
      }
    };

    fetchData();

    // Cleanup function to cancel the request when the component unmounts
    return () => source.cancel("Request canceled by the cleanup function");
  }, [productName, startDate, endDate, page, size]);


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
            onChange={(e) => handleInput(e.target.value)}
          />
        </PopoverTrigger>
        <PopoverContent w={"150%"}>
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
                    onClick={(e) => handleInput(e.target.value)}
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
        min={getCurrentDate()}
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
