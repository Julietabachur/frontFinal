import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./home/Detail.css";
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
  SimpleGrid,
} from "@chakra-ui/react";
import ProductGallery from "./ProductGallery";
import { useProductContext } from "./home/Global.context";
import axios from "axios";
import Specs from "./Specs";
const DetailPage = () => {
  const { startDate } = useProductContext();
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [reserveList, setReserveList] = useState([]);

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
    const isDateIncluded = availableDates.some(item => {
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
            <Text
              fontFamily={"Saira"}
              color={"black"}
              fontSize={"1.5rem"}
              marginLeft={"3%"}
            >
              {detail.productName}
            </Text>
            <Button
              onClick={() => navigate(-1)}
              bg={"verde2"}
              marginRight={"3%"}
            >
              Atras
            </Button>
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
              <ProductGallery
                thumbnail={detail.thumbnail}
                gallery={detail.gallery}
              />
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
          <HStack>
            <Text
              fontFamily={"Saira"}
              color={"black"}
              fontSize={"1rem"}
              marginLeft={"3%"}
            >
              Select Reservation Date:
            </Text>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              calendarClassName="date-picker-calendar"
              highlightDates={availableDates.map((date) => new Date(date))}
            />
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};

export default DetailPage;
