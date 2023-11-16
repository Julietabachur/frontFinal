import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { Modal, useDisclosure } from "@chakra-ui/react";
import { FcShare } from "react-icons/fc";
import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";
import {
  HStack,
  VStack,
  Image,
  Text,
  Box,
  Button,
  IconButton,
  Stack,
  Flex,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
import Specs from "./Specs";
const DetailPage = () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openShareModal, setOpenShareModal] = useState(false);
  
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

  const setShare = (origin) =>{
    if (origin == "facebook") {

      alert("PUBLICAR EN FACEBOOK");

    } else if (origin == "instagram") {

      alert("PUBLICAR EN Instagram");

    } else if (origin == "twitter") {

      alert("PUBLICAR EN Twitter");

    }

  };

  const handleCancel = () => {
    // Cierra el modal y resetea el formulario
    setOpenShareModal(false);
    //onClose();

  };

  return (
    <>
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
            <IconButton colorScheme='gray' variant='outline' size='lg' aria-label='Share' icon={<FcShare />} onClick={() => setOpenShareModal(true)}/>
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
          </Stack><Specs detail={detail}></Specs>
        </VStack>
      )}
      
    </VStack>

    <Modal isOpen={openShareModal} onClose={handleCancel} size={'sm'}>
        <ModalOverlay />
        <ModalContent mt={130} maxWidth="40%">
          <ModalHeader>Compartir</ModalHeader>
          <ModalCloseButton />
          <ModalBody borderColor={"black"}>
            <Flex  border={1}
              flexDirection="column"
              align={'center'}
              p={1}
              gap={5}
              my={1}
              maxHeight="45vh"
            >
              <Image w={120} h={150}  src={detail.thumbnail} alt={detail.productName} />
              <Text size='sm'>{detail.productName}</Text>
              <HStack>
              <IconButton colorScheme='gray' variant='outline' size='lg' aria-label='Share' icon={<FaFacebookSquare />} onClick={() => setShare('facebook')}/>
              <IconButton colorScheme='gray' variant='outline' size='lg' aria-label='Share' icon={<FaInstagram />} onClick={() => setShare('instagram')}/>
              <IconButton colorScheme='gray' variant='outline' size='lg' aria-label='Share' icon={<FaTwitter />} onClick={() => setShare('twitter')}/>
              </HStack>

              </Flex>
              </ModalBody>
              </ModalContent>

    </Modal>
    </>
  );
};

export default DetailPage;
