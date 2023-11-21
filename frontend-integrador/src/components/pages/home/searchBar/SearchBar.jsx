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

    <Box
    position={"relative"}
    w={'100%'}
    h={['400px','400px','400px']}
    bgImage="url('https://images-g3.s3.amazonaws.com/dise%C3%B1oweb-04.jpg')"
    /*bgImage="url('https://media.fashionnetwork.com/m/6f53/1ead/a8e7/7e1c/3bb9/6b16/01fc/7372/6fe4/492b/492b.jpg')"*/
    bgPosition="center">

    
    <Grid
    top={50}
    left={"12%"}
    position={"relative"}
    w={'75%'}
    h={['300px','300px','300px']}
    templateRows={['repeat(7, 1fr) ','20% 40% 20% 20%','30% 40% 30%']}
    templateColumns={['50% 50%','38% 38% 24%','5% 50% 15% 15% 10% 5%']}
    bg={'whiteAlpha.800'}
    p={[5,8,10]}
    boxShadow={"dark-lg"}
    >
      <GridItem display={"flex"} justifyContent={"flex-end"} gridRow={[1,1,1]} gridColumnStart={[2,3,6]}  gridColumnEnd={[3,4,7]} >
        <CloseIcon  as="button" fontSize={[13,15,20]} variant='link' color={"black"}></CloseIcon>
      </GridItem>
      <GridItem pt={[2,5,5]}  gridRow={[2,1,1]} gridColumnStart={[1,1,2]}  gridColumnEnd={[3,4,6]} >
        <Text textShadow={'dark-lg'} color={"black"} textAlign={"center"} fontFamily={"Saira"} fontWeight={"semibold"} fontSize={[16,20,30,34]}>
          ¿QUE ESTAS BUSCANDO?</Text>
      </GridItem>
      <GridItem  p={4} gridRow={[3,2,2]} gridColumnStart={[1,1,2]} gridColumnEnd={[3,4,6]}>
        <Text textShadow={'dark-lg'} textAlign={"center"} fontFamily={"Saira"} fontWeight={"medium"} fontSize={[12,15,18,20]}>
          Descubre los articulos disponibles en nuestra tienda dentro de un rango de fechas deseado.</Text>
      </GridItem>
      <GridItem px={2} gridRow={[4,3,3]} gridColumnStart={[1,1,2]} gridColumnEnd={[3,4,3]} >
        <Popover
        returnFocusOnClose={false}
        isOpen={searchResults && searchResults.length > 1}
        onClose={onClose}
        placement="bottom-start"
        closeOnBlur={false}
        >
          <PopoverTrigger>
            <Input
            bg={'white'}
            type="text"
            maxHeight={["20px","30px", "50px"]}
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
      <GridItem px={2} gridRow={[5,4,3]} gridColumnStart={[1,1,3]} gridColumnEnd={[2,2,4]}>
        <VStack  >
        {/* <Text>Fecha inicial</Text> */}
          <Input
          focusBorderColor='lime'
          type="date"
          color={'verde1'}
          min={startDate}
          fontSize={[12,14]}
          maxHeight={["20px","30px", "50px"]}
          value={startDate}
          boxShadow={'dark-lg'}
          variant={"filled"}
          onChange={(e) => setStartDate(e.target.value)}
          />
        </VStack>
      </GridItem>
      <GridItem px={2}  gridRow={[5,4,3]} gridColumnStart={[2,2,4]} gridColumnEnd={[3,3,5]}> 
        <VStack>
        {/* <Text>Fecha final</Text> */}
          <Input
          maxHeight={["20px","30px", "50px"]}
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
      <GridItem px={2}  gridRow={[6,4,3]} gridColumnStart={[1,3,5]} gridColumnEnd={[3,4,6]} >
        <Button maxHeight={["20px","30px", "50px"]} boxShadow={'dark-lg'} fontSize={[12,14]} focusBorderColor='lime' bg={"verde2"}  /*colorScheme="green"*/ w={'100%'} onClick={handleSearch}>Buscar</Button>
      </GridItem>
    </Grid>
    </Box>

   
  );
};

export default SearchBar;
