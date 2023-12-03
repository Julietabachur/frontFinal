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
  Spinner,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { useProductContext } from "../home/Global.context";
import RenderPagination from "../home/RenderPagination";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const ReservesPage = () => {
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const RESERVES_URL = import.meta.env.VITE_RESERVES_URL;
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [product, setProduct] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState(null);
  const [showError, setShowError] = useState(false);
  const [reserveList, setReserveList] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [user, setUser] = useState({});
  const [userReserves, setUserReserves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const reserveSuccess = useToast();

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

  // Función asincrónica para obtener todas las reservas del usuario actual
  const getReserves = async () => {
    if (user.reserveIds.length > 0 && userReserves.length === 0) {
      try {
        //asegura que userReserveIds siempre sea un array, incluso si user o reserveIds son nulos.
        const userReserveIds = user?.reserveIds || [];
        //patrón de "mapeo concurrente". En lugar de esperar a que cada promesa se resuelva secuencialmente,
        //se están generando todas las promesas al mismo tiempo y luego esperando a que todas se resuelvan con Promise.all.
        // Esto puede mejorar el rendimiento al realizar las solicitudes en paralelo.
        const promises = userReserveIds.map(async (reserveId) => {
          try {
            const response = await axios.get(`${RESERVES_URL}/${reserveId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data) {
              // Agrega la reserva obtenida al array de userReserves
              setUserReserves((prevReserves) => [
                ...prevReserves,
                response.data,
              ]);
            } else {
              console.error(`Error al obtener la reserva con ID ${reserveId}`);
            }
          } catch (error) {
            console.error(
              `Error en la solicitud para la reserva con ID ${reserveId}:`,
              error.message
            );
          }
        });
        // Espera a que todas las solicitudes se completen antes de continuar
        await Promise.all(promises);
      } catch (error) {
        console.error(
          "Error al obtener las reservas del usuario:",
          error.message
        );
      }
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
    setIsLoading(true);
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
        setIsLoading(false);
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
      setIsLoading(false);
      setShowError(true);
    }
  };

  const handleReservationToast = async (id) => {
    
     reserveSuccess.promise(handleReservation(id), {
      success: { title: "Reserva exitosa", description: "¡¡Felicidades!! , la reserva se realizo con exito " },
      error: { title: "Error al reservar", description: "Lamentablemente no pudimos realizar su reserva, pruebe nuevamente" },
      loading: { title: "Realizando reserva", description: "Por favor espere mientras se realiza la reserva" },
    });
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
    setIsLoading(false);
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

  useEffect(() => {
    if (Array.isArray(user.reserveIds) && user?.reserveIds.length > 0) {
      getReserves();
    }
  }, [user]);

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
      {/* código de la lista de reservas se muestra cuando se toca mis reservas
      condicional */}
      {banderaReservas ? (
        <Grid columns={2} w={"77%"} p={3} minH={"100vh"}>
          {userReserves.map((reserve) => (
            <GridItem
              key={reserve.id}
              borderRadius={9}
              mb={6}
              boxShadow={"2xl"}
              p={3}
            >
              <HStack w={"100%"}>
                <Image
                  h={180}
                  src={reserve.reserveImg}
                  alt="imagen"
                  objectFit={"cover"}
                />
                <VStack justify={"center"} w={"100%"}>
                  <Text fontSize={"2rem"}>{reserve.productName}</Text>
                  <Text
                    fontSize={"1.3rem"}
                  >{`Reservado desde el: ${reserve.startDate} hasta el ${reserve.endDate}`}</Text>
                </VStack>
              </HStack>
            </GridItem>
          ))}
        </Grid>
      ) : (
        //Muestra las cards de las reservas, aqui pondria el condicional
        <SimpleGrid w={"100%"} spacing={4} minChildWidth="300px" minH={"100vh"}>
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
              minW={100}
              onClick={() => handleReservationToast(product.id)}
            >
              {isLoading ? <Spinner color="black" /> : "Reservar"}
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
