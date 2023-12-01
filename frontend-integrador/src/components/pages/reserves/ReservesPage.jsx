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
  const [selectedFinishDate, setSelectedFinishDate] = useState(null);
  const [showError, setShowError] = useState(false);
  const [reserveList, setReserveList] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState({
    inicial: "",
    final: "",
  });
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
    banderaReservas,
  } = useProductContext();
  const navigate = useNavigate();

  const getUser = async () => {
    const response = await axios.get(
      `${baseUrl}/api/v1/private/clients/${clientId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) {
      setUser(response.data);
    }
  };

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
      productName: product.productName,
      startDate: selectedDate,
      endDate: selectedFinishDate,
      reserveImg: product.thumbnail,
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
        setSelectedFinishDate(null);
        setError({
          inicial: "",
          final: "",
        });
        setShowError(false);
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
    setSelectedFinishDate(null);
    setError({
      inicial: "",
      final: "",
    });
    setShowError(false);
    onClose();
  };

  //setea la fecha inicial comprobando si no es menor a la fecha actual
  const handleSelectedDate = (date) => {
    if (date >= new Date()) {
      setSelectedDate(date);
      setError((prev) => {
        return { ...prev, inicial: "" };
      });
    } else {
      setError((prev) => {
        setSelectedDate(null);
        return {
          ...prev,
          inicial: "La fecha inicial no puede ser menor o igual a la actual",
        };
      });
    }
  };

  //setea la fecha final comprobando si no es menor a la fecha actual y tampoco menor a la inicial
  const handleSelectedFinishDate = (date) => {
    if (date >= new Date() && date >= selectedDate) {
      setSelectedFinishDate(date);
      setError((prev) => {
        return { ...prev, final: "" };
      });
    } else {
      setError((prev) => {
        setSelectedFinishDate(null);
        return {
          ...prev,
          final:
            "La fecha final no puede ser antes de la fecha inicial o el dia actual",
        };
      });
    }
  };

  useEffect(() => {
    getReserved();
  }, [reserveList]);

  useEffect(() => {
    getUser();
  }, [clientId]);

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
      //código de la lista de reservas se muestra cuando se toca mis reservas
      condicional
      {banderaReservas ? (
        <SimpleGrid columns={2} w={"100%"} spacing={4} minChildWidth="300px">
          {reserveList.map((reserve) => (
            <HStack key={reserve.id} borderRadius={6} boxShadow={"2xl"} p={3}>
              <Image
                boxSize={"sm"}
                src={reserve.reserveImg}
                alt="imagen"
                objectFit={"cover"}
              />
              <VStack>
                <Text>{reserve.productName}</Text>
                <Text>{`Inicio: ${reserve.startDate}`}</Text>
                <Text>{`Fin: ${reserve.endDate}`}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      ) : (
        //Muestra las cards de las reservas, aqui pondria el condicional
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
      )}
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={() => handleClose()}
        product={product}
        availableDates={availableDates}
        selectedDate={selectedDate}
        selectedFinishDate={selectedFinishDate}
        user={user}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`Hola ${user.clientName} ,desde aqui podras reservar tu prenda favorita `}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack
              borderRadius={5}
              p={3}
              justify={"flex-start"}
              align={"flex-start"}
              shadow={"2xl"}
              border={"1px solid green"}
            >
              <Text>
                <Box as="span" fontWeight="bold">
                  Usuario:
                </Box>{" "}
                {`${user?.firstName} ${user?.lastName} (${user?.clientName})`}
              </Text>
              <Text>
                <Box as="span" fontWeight="bold">
                  Email:
                </Box>{" "}
                {user?.email}
              </Text>
              <Text>
                <Box as="span" fontWeight="bold">
                  Prenda:
                </Box>{" "}
                {product?.productName}
              </Text>
            </VStack>

            <VStack
              mt={5}
              borderRadius={5}
              p={3}
              justify={"flex-start"}
              shadow={"2xl"}
              border={"1px solid green"}
            >
              <Text fontSize={"1.5rem"} textAlign={"center"} mt={2}>
                Fechas disponibles
              </Text>
              <HStack justify={"space-around"} w={"100%"}>
                <Text mt={2}>Fechas de inicio</Text>
                <Text mt={2}>Fechas de termino</Text>
              </HStack>

              <HStack w={"100%"}>
                <Box w={"50%"}>
                  <DatePicker
                    locale="es"
                    selected={selectedDate}
                    onChange={handleSelectedDate}
                    inline
                    calendarClassName="date-picker-calendar"
                    highlightDates={availableDates.map(
                      (date) => new Date(date)
                    )}
                  />
                </Box>
                <Box w={"50%"}>
                  <DatePicker
                    disabled={!selectedDate}
                    locale="es"
                    selected={selectedFinishDate}
                    onChange={handleSelectedFinishDate}
                    inline
                    calendarClassName="date-picker-calendar"
                    highlightDates={availableDates.map(
                      (date) => new Date(date)
                    )}
                  />
                </Box>
              </HStack>

              <HStack>
                <HStack>
                  {error.inicial && (
                    <Text color={"red.400"}>{error.inicial}</Text>
                  )}
                  {error.final && <Text color={"red.400"}>{error.final}</Text>}
                </HStack>
                <HStack>
                  {" "}
                  {selectedDate &&
                    !error.final &&
                    !error.inicial &&
                    !selectedFinishDate && (
                      <Text>{`Desde el ${selectedDate.toLocaleDateString()}`}</Text>
                    )}
                  {!selectedDate &&
                    !error.final &&
                    !error.inicial &&
                    selectedFinishDate && (
                      <Text>{`hasta el ${selectedFinishDate.toLocaleDateString()}`}</Text>
                    )}
                  {selectedDate &&
                    selectedFinishDate &&
                    !error.final &&
                    !error.inicial && (
                      <Text>{`Desde el ${selectedDate.toLocaleDateString()} hasta el ${selectedFinishDate.toLocaleDateString()}`}</Text>
                    )}
                  {showError && (
                    <Text color={"red.500"}>
                      el rango de fechas selelccionado no puede incluir dias no
                      habilitados por favor selecciona otro rango de fechas
                    </Text>
                  )}
                </HStack>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              bg={"verde2"}
              shadow={"2xl"}
              mr={3}
              onClick={() => handleReservation(product.id)}
            >
              Reservar
            </Button>
            <Button
              shadow={"2xl"}
              bg={"green.200"}
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <RenderPagination />
    </VStack>
  );
};

export default ReservesPage;
