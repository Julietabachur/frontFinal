import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios, { Axios } from "axios";
import {
  HStack,
  Box,
  VStack,
  Avatar,
  Grid,
  GridItem,
  Button,
  Text,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
  Flex,
  Stack,
  Divider,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import LogoutButton from "./LogoutButton";
import { useProductContext } from "./pages/home/Global.context";
import { Link as ReactRouterLink } from "react-router-dom";

const Perfil = () => {
  const { getFavorites, paginatedData, clientId} = useProductContext();
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const RESERVES_URL = import.meta.env.VITE_RESERVES_URL;
  const [user, setUser] = useState({});
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  // Estado para almacenar la lista de reservas del usuario
  const [userReserves, setUserReserves] = useState([]);

  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    navigate("/");
    window.location.reload();
  };

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
    console.log(user.reserveId);
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
            setUserReserves((prevReserves) => [...prevReserves, response.data]);
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
  };

  // Llamada a la función de obtener reservas del usuario cuando el componente se monta
  useEffect(() => {
    console.log(user);
    console.log("acá");
    if ( Array.isArray(user.reserveIds) && user?.reserveIds.length > 0) {
      getReserves();
    }
  }, [user]);

  useEffect(() => {
    if (clientId && token){
    getUser();
    }
  }, [clientId, token]);

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <Grid
      h={"auto"}
      w={"99vw"}
      templateRows={{ base: "repeat(4, 1fr)", md: "repeat(3, 1fr)" }}
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(5, 1fr)",
      }}
      gap={4}
      mt={5}
      bg={"gray.200"}
    >
      <GridItem
        as={"aside"}
        rowSpan={{ base: 1, md: 3 }}
        colSpan={{ base: 5, md: 1 }}
        bg="blanco"
        p={7}
      >
        <SimpleGrid spacing={2} mt={7} w={"100%"} justifyContent={"center"}>
          <Avatar
            boxSize={{ base: "50px", md: 100 }}
            size={{ base: "lg", md: "2xl" }}
            name={user?.clientName}
            justifySelf={"center"}
          />
          <Text textAlign={"center"} color={"verde1"} fontSize={20}>
            {user?.clientName}
          </Text>
          <Text textAlign={"center"}>{user?.email}</Text>
          <LogoutButton
          /* justifySelf={"center"}
            w={"130px"}
            bg={"red.400"}
            color={"blanco"}
            onClick={logoutHandle} */
          />
          <UnorderedList
            direction={{ base: "row", md: "column" }}
            listStyleType={"none"}
            m={0}
          >
            <ListItem textAlign={"center"}>Reservas</ListItem>
            <ListItem textAlign={"center"}>Editar Perfil</ListItem>
            <ListItem textAlign={"center"}>Contactos</ListItem>
            <ListItem textAlign={"center"}>Configuración</ListItem>
          </UnorderedList>
        </SimpleGrid>
      </GridItem>

      <GridItem
        colSpan={{ base: 5, md: 2 }}
        rowSpan={{ base: 1, md: 2 }}
        bg="blanco"
        minW={{ base: "300px", md: "500px" }}
      >
        <VStack
          p={5}
          justify={"flex-start"}
          direction={"column"}
          align={"flex-start"}
        >
          <Box
            color="verde1"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize={{ base: "2xl", md: "4xl" }}
            alignSelf={{ base: "center", md: "flex-start" }}
            textShadow={"10px 10px 10px gray"}
          >
            Información Personal
          </Box>
          <Flex
            boxShadow={"15px 15px 15px gray"}
            justify={"flex-start"}
            direction={"column"}
            align={"flex-start"}
            w={"100%"}
            mt={15}
            p={5}
            borderRadius={6}
            border={"1px solid lightblue"}
          >
            <Text fontSize={{ base: 15, md: 20 }}>
              Nombre de usuario: {user?.username}
            </Text>
            <Text fontSize={{ base: 15, md: 20 }}>
              Nombre: {user?.firstName ? user.firstName : "John"}
            </Text>
            <Text fontSize={{ base: 15, md: 20 }}>
              Apellido: {user?.firstName ? user.lastName : "Doe"}
            </Text>
            <Text fontSize={{ base: 15, md: 20 }}>
              Correo electrónico: {user?.email}
            </Text>
            <Stack>
              <Divider m={3} />
              <Text fontSize={{ base: 20, md: 25 }} color={"verde1"}>
                Informarción de residencia
              </Text>
              <Text fontSize={{ base: 15, md: 20 }}>
                Dirección:{" "}
                {user?.address
                  ? user.address.calle + user.address.number
                  : "Siempre viva 4354"}
              </Text>
              <Text fontSize={{ base: 15, md: 20 }}>
                País: {user?.address ? user.address.country : "Uruguay"}
              </Text>
              <Text fontSize={{ base: 15, md: 20 }}>
                Ciudad: {user?.address ? user.address.city : "Montevideo"}
              </Text>
            </Stack>
          </Flex>
        </VStack>
      </GridItem>
      <GridItem
        colSpan={{ base: 5, md: 2 }}
        rowSpan={{ base: 1, md: 2 }}
        bg="blanco"
        minW={{ base: "300px", md: "500px" }}
      >
        <VStack
          p={5}
          justify={"flex-start"}
          direction={"column"}
          align={"flex-start"}
        >
          <Box
            color="verde1"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize={{ base: "2xl", md: "4xl" }}
            alignSelf={{ base: "center", md: "flex-start" }}
            textShadow={"10px 10px 10px gray"}
          >
            Favoritos
          </Box>

          <SimpleGrid
            mt={"15px"}
            p={2.5}
            spacing={2}
            minChildWidth="160px"
            w={"100%"}
            borderRadius={6}
            border={"1px solid lightblue"}
            boxShadow={"15px 15px 15px gray"}
          >
            {paginatedData.map((item) => (
              <Link
                as={ReactRouterLink}
                key={item.id}
                to={`/detalle/${item.id}`}
              >
                <Box boxShadow={"5px 5px 15px gray"} m={3} borderRadius={8}>
                  <Image
                    boxSize={20}
                    w={"100%"}
                    src={item.thumbnail}
                    borderRadius={8}
                    objectFit={"cover"}
                  />
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </VStack>
      </GridItem>
      <GridItem colSpan={5} bg="blanco">
        <Box m={3}>
          {userReserves.length > 0 ? (
            // Renderiza las reservas del usuario si hay alguna
            userReserves.map((reserve) => (
              <div key={reserve.id}>
                {/* Renderiza los detalles de la reserva del usuario */}
                <div key={reserve.id}>
                  <p>Reserva ID: {reserve.id}</p>
                  <p>Fecha de inicio: {reserve.startDate}</p>
                  <p>Fecha de finalización: {reserve.endDate}</p>
                  <p>
                    Imagen de la reserva:{" "}
                    <img src={reserve.reserveImg} alt="Reserva" />
                  </p>
                  <p>Nombre del producto: {reserve.productName}</p>
                </div>
              </div>
            ))
          ) : (
            <Text fontSize={30}>No hay reservas del usuario para mostrar.</Text>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
};

export default Perfil;
