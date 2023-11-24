import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./home/Detail.css";
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
import { useProductContext } from "./home/Global.context";
import axios from "axios";
import Specs from "./Specs";
import SocialShare from "./SocialShare";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import Policies from "./Policies";

const DetailPage = () => {
  const { startDate } = useProductContext();
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const frontUrl = import.meta.env.VITE_LOGIN_URL;
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [reserveList, setReserveList] = useState([]);

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

  const getReserveList = async () => {
    const response = await axios.get(
      `${baseUrl}/api/v1/public/reserves/search/byProductId?productId=${detail.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      console.log(response.data);
      setReserveList(response.data);
    }
  };

  const getReserved = () => {
    let updatedAvailableDates = [];
    reserveList.forEach((reserva) => {
      const startDate = new Date(reserva.startDate);
      const endDate = new Date(reserva.endDate);
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        updatedAvailableDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    setAvailableDates((prevDates) => [...prevDates, ...updatedAvailableDates]);
  };

  useEffect(() => {
    getReserved();
  }, [reserveList]);

  useEffect(() => {
    getReserveList();
  }, [detail]);

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
    const isDateIncluded = availableDates.some((item) => {
      return (
        item?.getFullYear() === selectedDate?.getFullYear() &&
        item?.getMonth() === selectedDate?.getMonth() &&
        item?.getDate() === selectedDate?.getDate()
      );
    });

    if (isDateIncluded) {
    }
  }, [selectedDate, availableDates]);

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
          <VStack
            spacing={4}
            color={"blanco"}
            w={"70vw"}
            justifySelf={"center"}
          >
            <HStack p={5} spacing={[2,5]}
              justify={"space-between"}
              w={"100%"}
              color={"blanco"}
              border={"2px solid black"}
              alignContent={"center"}
              justifyContent={"space-between"}
              >
             
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
                <Box>
                <FcShare
                 colorScheme="gray"
                 variant="outline"
                 size={30}
                 onClick={() => setOpenShareModal(true)}
                ></FcShare>
                </Box>
              
                          
                <Text
                  readOnly={true}
                  w={"85%"}
                  fontFamily={"Saira"}
                  color={"black"}
                  fontWeight={"semibold"}
                  ml={[2,2,5]}
                  fontSize={["1rem","1.3rem","1.7rem"]}
                  style={{
                    caretColor: "transparent",
                    background: "transparent",
                    border: "none",
                  }}
                >
                  {detail.productName}
                </Text>

                <Button
                alignSelf={"flex-end"}
                fontSize={["0.8rem", "1rem"]}
                onClick={() => navigate(-1)}
                bg={"verde2"}
              >
                Atras
              </Button>
              
             
            </HStack>


            <VStack border={"2px solid black"} spacing={[2,5]} p={[5,10]} alignItems="flex-start">
              <Text as='u' textAlign={"center"} fontFamily="Saira" fontWeight={"medium"} color="black" fontSize={["1rem", "1.3rem"]}>
                    DESCRIPCIÓN DEL PRODUCTO
                </Text>
              <Text
                fontFamily={"Podkova"}
                color={"black"}
                fontSize={["0.8rem", "1rem","1.2rem"]}
              >
                {detail.detail}
              </Text>
            </VStack>
            <Stack border={"2px solid black"} spacing={[2,5]} p={5}>
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
            <Box width="100%" padding={4} h={"100%"} border={"2px solid black"}>
            <VStack  spacing={[2,5]} p={5} alignItems="flex-start">
            <Text as='u' fontFamily="Saira" marginLeft={4} fontWeight={"medium"} color="black" fontSize={["1rem", "1.3rem"]}>
              DISPONIBILIDAD DEL PRODUCTO
            </Text>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                calendarClassName="date-picker-calendar"
                highlightDates={availableDates.map((date) => new Date(date))}
              />
            </VStack>
            </Box>
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
          shareText={detail?.detail}
          shareImage={detail.thumbnail}
          shareUrl={`${frontUrl}/detalle/${id}`}
        />
      )}
      ;
    </>
  );
};

export default DetailPage;
