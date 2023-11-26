import React, { useRef, useEffect, useState } from "react";
import SearchBar from "../home/searchBar/SearchBar";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import {
  Text,
  VStack,
  SimpleGrid,
  Box,
  Image,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useProductContext } from "../home/Global.context";
import RenderPagination from "../home/RenderPagination";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const ReservesPage = () => {
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [product, setProduct] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFinishDate, setSelectedFinishdate] = useState(null);
  const [showError, setShowError] = useState(false);
  const [reserveList, setReserveList] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const initialRef = React.useRef(null);
  const {
    paginatedData,
    clientId,
    reservation,
    setReservation,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useProductContext();
  const navigate = useNavigate();

  const getReserveList = async (id) => {
    const response = await axios.get(
      `${baseUrl}/api/v1/public/reserves/search/byProductId?productId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) {
      setReserveList(response.data);
      setShowError(false);
    } else {
      setShowError(true);
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

  const handleReservation = async (id) => {
    const body = {
      clientId: clientId,
      productId: id,
      startDate: selectedDate,
      endDate: selectedFinishDate,
    };
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/private/reserves`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setReservation("");
        setReserveList([]);
        setAvailableDates([]);
        setSelectedDate(null);
        setSelectedFinishdate(null);
        onClose();
      }
    } catch (error) {
      setShowError(true);
    }
  };

  useEffect(() => {
    const getProduct = async (reservation) => {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/${reservation}`
      );
      if (response.data) {
        setProduct(response.data);

        onOpen();
      }
    };
    if (reservation) {
      getProduct(reservation);
      getReserveList(reservation);
    }
  }, [reservation]);

  const handleClose = () => {
    setReservation("");
    setReserveList([]);
    setAvailableDates([]);
    setSelectedDate(null);
    setSelectedFinishdate(null);
    onClose();
  };

  useEffect(() => {
    getReserved();
  }, [reserveList]);

  return (
    <VStack w={"100%"}>
      <Text
        fontFamily={"Saira"}
        color={"black"}
        fontSize={"2.5rem"}
        w={"100%"}
        textAlign={"center"}
      >
        Reservas
      </Text>
      <SearchBar />
      <SimpleGrid w={"100%"} spacing={4} minChildWidth="300px">
        {paginatedData.map((product) => (
          <VStack key={product.id} borderRadius={6} boxShadow={"2xl"} p={3}>
            <Image
              boxSize={"sm"}
              src={product.thumbnail}
              alt="imagen"
              objectFit={"cover"}
            />

            <HStack>
              <Button
                bg={"verde2"}
                onClick={() => {
                  navigate(`/detalle/${product.id}`);
                }}
              >
                Detalle
              </Button>
              <Button
                bg={"verde2"}
                onClick={() => {
                  setReservation(product.id);
                }}
              >
                Reservar
              </Button>
            </HStack>
          </VStack>
        ))}
      </SimpleGrid>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={() => handleClose()}
        product={product}
        availableDates={availableDates}
        selectedDate={selectedDate}
        selectedFinishDate={selectedDate}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Elige las fechas de tu reserva</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>{product?.productName}</Text>
            <Text>Fechas disponibles</Text>
            <Text>Fechas de inicio</Text>
            <DatePicker
              locale="es"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              calendarClassName="date-picker-calendar"
              highlightDates={availableDates.map((date) => new Date(date))}
            />

            <Text>Fechas de término</Text>
            <DatePicker
              locale="es"
              selected={selectedFinishDate}
              onChange={(date) => setSelectedFinishdate(date)}
              inline
              calendarClassName="date-picker-calendar"
              highlightDates={availableDates.map((date) => new Date(date))}
            />

            {/*   <FormControl>
              <FormLabel>Fecha de inicio</FormLabel>
              <Input
                focusBorderColor="lime"
                type="date"
                color={"verde1"}
                fontSize={[12, 14]}
                maxHeight={["20px", "30px", "40px"]}
                value={startDate}
                boxShadow={"dark-lg"}
                variant={"filled"}
                onChange={(e) => setStartDate(e.target.value)}
                
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Fecha de termino</FormLabel>
              <Input
                focusBorderColor="lime"
                type="date"
                color={"verde1"}
                fontSize={[12, 14]}
                maxHeight={["20px", "30px", "40px"]}
                value={endDate}
                boxShadow={"dark-lg"}
                variant={"filled"}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormControl> */}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleReservation(product.id)}
            >
              Reservar
            </Button>
            <Button onClick={() => handleClose()}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <RenderPagination />
    </VStack>
  );
};

export default ReservesPage;
