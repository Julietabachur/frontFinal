import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
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
  SimpleGrid,
} from "@chakra-ui/react";
import LogoutButton from "./LogoutButton";

const Perfil = ({username, token }) => {
  const USER_URL = import.meta.env.VITE_USER_URL;
  const [user, setUser] = useState({});

  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    navigate("/");
    window.location.reload();
  };
  
  const getUser = async (username) => {
    const response = await axios.get(`${USER_URL}username=${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response) {
      setUser(response.data);
    }
  };

  useEffect(() => {
    if (token) {
      getUser(username);
    }
  }, [token]);

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
            name={username || user?.clientName}
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
            Informacion Personal
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
              nombre: {user?.firstName ? user.firstName : "John"}
            </Text>
            <Text fontSize={{ base: 15, md: 20 }}>
              Apellido: {user?.firstName ? user.lastName : "Doe"}
            </Text>
            <Text fontSize={{ base: 15, md: 20 }}>
              Correo electronico: {user?.email}
            </Text>
            <Stack>
              <Divider m={3} />
              <Text fontSize={{ base: 20, md: 25 }} color={"verde1"}>
                Informarcion de Residencia
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
            Informacion Personal
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
              nombre: {user?.firstName ? user.firstName : "John"}
            </Text>
            <Text fontSize={{ base: 15, md: 20 }}>
              Apellido: {user?.firstName ? user.lastName : "Doe"}
            </Text>
            <Text fontSize={{ base: 15, md: 20 }}>
              Correo electronico: {user?.email}
            </Text>
            <Stack>
              <Divider m={3} />
              <Text fontSize={{ base: 20, md: 25 }} color={"verde1"}>
                Informarcion de Residencia
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
      <GridItem colSpan={{ base: 5, md: 4 }} bg="blanco" >{user?.cel? user.cel: '555 555 092'}</GridItem>
    </Grid>
  );
};

export default Perfil;
