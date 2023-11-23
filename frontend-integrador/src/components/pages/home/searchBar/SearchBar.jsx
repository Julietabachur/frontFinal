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
  Icon
} from "@chakra-ui/react";
import { CancelToken } from "axios";
import { useProductContext } from "../Global.context";
import { color } from "framer-motion";
import {CloseIcon} from '@chakra-ui/icons'

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

    <Box
    position={"relative"}
    w={'100%'}
    h={['300px','300px','300px']}
    bgGradient="linear(to-t, green, white)">

    
    <Grid
    top={50}
    left={"12%"}
    position={"relative"}
    w={'75%'}
    h={['200px','200px','200px']}
    templateRows={['15% 35% 20% 15% 15%','20% 35% 25% 20%','30% 40% 30%']}
    templateColumns={['50% 50%','38% 38% 24%','50% 20% 20% 10%']}
    bg={'whiteAlpha.800'}
    p={5}
    boxShadow={"dark-lg"}
    >
      <GridItem gridRow={[1,1,1]} gridColumnStart={[1,1,1]}  gridColumnEnd={[3,4,5]} >
        <Text textShadow={'dark-lg'} color={"black"} textAlign={"center"} fontFamily={"Saira"} fontWeight={"semibold"} fontSize={[16,22,30]}>
          ¿QUE ESTAS BUSCANDO?</Text>
      </GridItem>
      <GridItem py={2} px={[5,5,10]} gridRow={[2,2,2]} gridColumnStart={[1,1,1]} gridColumnEnd={[3,4,5]}>
        <Text textShadow={'dark-lg'} textAlign={"center"} fontFamily={"Saira"} fontWeight={["normal", "medium"]} fontSize={[12,13,16,18]}>
          Descubre los articulos disponibles en nuestra tienda dentro de un rango de fechas deseado.</Text>
      </GridItem>
      <GridItem px={2} gridRow={[3,3,3]} gridColumnStart={[1,1,1]} gridColumnEnd={[3,4,2]} >
        <Popover
        returnFocusOnClose={false}
        isOpen={searchResults && searchResults.length > 1}
        onClose={onClose}
        placement="bottom-start"
        closeOnBlur={false}
        >
          <PopoverTrigger>
            <Input
            type="text"
            maxHeight={["20px","30px", "40px"]}
            focusBorderColor='lime'
            value={productName}
            variant={'filled'}
            colorScheme="crimson"
            color={'verde1'}
            boxShadow={'dark-lg'}
            fontSize={[12,14]}
            placeholder="Escribe aqui el nombre de la prenda que buscas"
            onChange={(e) => setProductName(e.target.value)}
            />
          </PopoverTrigger>
          <PopoverContent /*</Popover>minW={"150%"}*/>
            <PopoverBody >
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
      </GridItem>
      <GridItem px={2} gridRow={[4,4,3]} gridColumnStart={[1,1,2]} gridColumnEnd={[2,2,3]}>
        <VStack  >
        {/* <Text>Fecha inicial</Text> */}
          <Input
          focusBorderColor='lime'
          type="date"
          color={'verde1'}
          min={startDate}
          fontSize={[12,14]}
          maxHeight={["20px","30px", "40px"]}
          value={startDate}
          boxShadow={'dark-lg'}
          variant={"filled"}
          onChange={(e) => setStartDate(e.target.value)}
          />
        </VStack>
      </GridItem>
      <GridItem px={2}  gridRow={[4,4,3]} gridColumnStart={[2,2,3]} gridColumnEnd={[3,3,4]}> 
        <VStack>
        {/* <Text>Fecha final</Text> */}
          <Input
          maxHeight={["20px","30px", "40px"]}
          focusBorderColor='lime'
          boxShadow={'dark-lg'}
          color={'verde1'}
          variant={"filled"}
          type="date"
          fontSize={[12,14]}
          onChange={(e) => setEndDate(e.target.value)}
          />
        </VStack>
      </GridItem>
      <GridItem px={2}  gridRow={[5,4,3]} gridColumnStart={[1,3,4]} gridColumnEnd={[3,4,5]} >
        <Button maxHeight={["20px","30px", "40px"]} boxShadow={'dark-lg'} fontSize={[12,14]} focusBorderColor='lime' bg={"verde2"}  /*colorScheme="green"*/ w={'100%'} onClick={handleSearch}>Buscar</Button>
      </GridItem>
    </Grid>
    </Box>

   
  );
};

export default SearchBar;
