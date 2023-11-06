import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import {
  HStack,
  VStack,
  Image,
  Text,
  Box,
  Button,
  Stack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid 
} from "@chakra-ui/react";
import ProductGallery from "./ProductGallery";

import axios from "axios";
const DetailPage = () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handleGallery = () => {
    onOpen();
  };

  const getDetail = async () => {
    const response = await axios.get(
      `${baseUrl}/api/v1/public/products/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      setDetail(response.data);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <VStack m={1} w={"98vw"} display={"flex"} justifyContent={"center"} p={20}>
      {detail && (
        <VStack color={"blanco"} w={"70vw"} justifySelf={"center"}>
          <HStack
            justify={"space-between"}
            w={"100%"}
            h={"60px"}
            color={"blanco"}
            border={"1px solid black"}
            alignContent={"center"}
            justifyContent={"space-between"}
            padding={"10px"}
            minW={"300px"}
          >
            <Text fontFamily={"Saira"} color={"black"} fontSize={"1.5rem"} marginLeft={"3%"}>
              {detail.productName}
            </Text>
            <Button onClick={() => navigate(-1)} bg={"verde2"} marginRight={"3%"}> Atras </Button>
          </HStack>

          <Stack border={"1px solid black"}>
            <VStack border={"1px solid black"} p={20}>
              <Stack
                h={"30px"}
                border={"1px solid black"}
                w={"30%"}
                minW={"300px"}
                textAlign="center"
              >
                <Text
                  fontFamily={"Saira"}
                  color={"black"}
                  fontSize={"1rem"}
                  p={1}
                >
                  DESCRIPCIÓN DEL PRODUCTO
                </Text>
              </Stack>
              <Text
                fontFamily={"Podkova"}
                color={"black"}
                fontSize={"23px"}
                marginTop={"20px"}
              >
                {detail.detail}
              </Text>
            </VStack>
            <Stack p={2}>
              <ProductGallery thumbnail={detail.thumbnail} gallery={detail.gallery} />
            </Stack>
            {Array.isArray(detail.gallery) && detail.gallery.length > 5 && (
              <>
                <Button
                  onClick={handleGallery}
                  bg={"verde2"}
                  alignSelf={"flex-end"}
                  w={20}
                  mr={5}
                  mb={5}
                >
                  Ver más
                </Button>
                <Drawer onClose={onClose} isOpen={isOpen} size={"full"}>
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{`Galería de Imágenes`}</DrawerHeader>
                    <DrawerBody>
                    <SimpleGrid minChildWidth='400px' spacing='20px'>
                        {detail.gallery.map((img,index) => (
                          <Box key={index}>
                            <Image w={'100%'} h={'100%'} objectFit={'cover'} src={img} alt="photo" />
                          </Box>
                        ))}
                      </SimpleGrid>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </>
            )}
          </Stack>
        </VStack>
      )}
    </VStack>
  );
};

export default DetailPage;
