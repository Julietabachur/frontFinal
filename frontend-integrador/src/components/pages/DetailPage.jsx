import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { FcShare } from "react-icons/fc";
import {
  HStack,
  VStack,
  Image,
  Text,
  Box,
  Button,
  IconButton,
  Stack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
} from "@chakra-ui/react";
import ProductGallery from "./ProductGallery";

import axios from "axios";
import Specs from "./Specs";
import SocialShare from "./SocialShare";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useProductContext } from "./home/Global.context";
import Policies from "./Policies";

const DetailPage = () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const frontUrl = import.meta.env.VITE_LOGIN_URL;
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isHeartClicked, setHeartClicked] = useState(false);
  const { setFavorites, favorites } = useProductContext();

  // Verificar si el item.id está en el array de favoritos
  const isFavorite = favorites.includes(id);

  // Confirma si 'riskkojwt' existe, es decir, si la persona ya está registrada.
  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  useEffect(() => {
    // Actualizar el estado del corazón basado en si el id está en favoritos
    const isFavorite = favorites.includes(id);
    setHeartClicked(isFavorite);
  }, [id]);

  const handleGallery = () => {
    onOpen();
  };

  const handleHeartClick = (event) => {
    // Cambiar el estado del clic del corazón
    setHeartClicked(!isHeartClicked);

    // Actualizar favoritos según el estado del corazón
    const updatedFavorites = isHeartClicked
      ? favorites.filter((productId) => productId !== id) // Quitar de favoritos si estaba
      : [...favorites, id]; // Agregar a favoritos si no estaba

    setFavorites(updatedFavorites);
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
    <>
      <VStack
        m={1}
        w={"98vw"}
        display={"flex"}
        justifyContent={"center"}
        p={20}
      >
        {detail && (
          <VStack spacing={4} color={"blanco"} w={"70vw"} justifySelf={"center"}>
            <HStack
              justify={"space-between"}
              w={"100%"}
              h={"60px"}
              color={"blanco"}
              border={"2px solid black"}
              alignContent={"center"}
              justifyContent={"space-between"}
              padding={"10px"}
              minW={"300px"}
            >
              <HStack ml={5} w="50%">
                {token && (
                  <Box
                    onClick={handleHeartClick}
                    color="green"
                    _hover={{
                      color: "green",
                    }}
                  >
                    {isFavorite ? (
                      <FaHeart size={30} />
                    ) : (
                      <FaRegHeart size={30} />
                    )}
                  </Box>
                )}
                <IconButton
                  colorScheme="gray"
                  variant="outline"
                  size="lg"
                  aria-label="Share"
                  icon={<FcShare />}
                  onClick={() => setOpenShareModal(true)}
                />
                <Text
                  readOnly={true}
                  fontFamily={"Saira"}
                  color={"black"}
                  fontWeight={"semibold"}
                  fontSize={"1.7rem"}
                  marginLeft={"3%"}
                  style={{
                    caretColor: "transparent",
                    background: "transparent",
                    border: "none",
                  }}
                >
                  {detail.productName}
                </Text>
              </HStack>
              <Button
                onClick={() => navigate(-1)}
                bg={"verde2"}
                marginRight={5}
              >
                Atras
              </Button>
            </HStack> 
              <VStack border={"2px solid black"} p={10}>
                  <Text textAlign={"center"} fontFamily="Saira" fontWeight={"semibold"} color="black" fontSize={["1rem", "1.3rem"]}
                  >
                    DESCRIPCIÓN DEL PRODUCTO
                  </Text>
                <Text
                  fontFamily={"Podkova"}
                  color={"black"}
                  fontSize={"20px"}
                  marginTop={"20px"}
                >
                  {detail.detail}
                </Text>
              </VStack>          
              <Stack border={"2px solid black"}  p={2}>
                <ProductGallery
                  thumbnail={detail.thumbnail}
                  gallery={detail.gallery}
                />
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
                        <SimpleGrid minChildWidth="400px" spacing="20px">
                          {detail.gallery.map((img, index) => (
                            <Box key={index}>
                              <Image
                                w={"100%"}
                                h={"100%"}
                                objectFit={"cover"}
                                src={img}
                                alt="photo"
                              />
                            </Box>
                          ))}
                        </SimpleGrid>
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                </>
              )}
              </Stack>     
            <Specs detail={detail}></Specs>
            <Policies></Policies>
          </VStack>
        )}
      </VStack>
      {openShareModal && (
        <SocialShare
          openShareModal={openShareModal}
          setOpenShareModal={setOpenShareModal}
          detail={detail}
          shareTitle={detail.productName}
          shareText={detail.detail}
          shareImage={detail.thumbnail}
          shareUrl={`${frontUrl}/detalle/${id}`}
        />
      )}
      ;
    </>
  );
};

export default DetailPage;
