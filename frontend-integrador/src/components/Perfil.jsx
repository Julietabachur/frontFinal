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
  Flex
} from "@chakra-ui/react";

const Perfil = ({ token }) => {
  const USER_URL = import.meta.env.VITE_USER_URL;
  const [user, setUser] = useState({});
  const { username } = useParams();
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
      h={"80vh"}
      w={"99vw"}
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(5, 1fr)"
      gap={4}
      mt={5}
      bg={"gris2"}
    >
      <GridItem rowSpan={3} colSpan={1} bg="blanco" p={7}>
        <VStack spacing={6} mt={7}>
          <Avatar
            boxSize={100}
            size={"2xl"}
            name={username || user?.clientName}
          />
          <Text>{user?.clientName}</Text>
          <Text>{user?.email}</Text>
          <Button>Desconectar</Button>
          <UnorderedList>
            <ListItem>Reservas</ListItem>
            <ListItem>Editar Perfil</ListItem>
            <ListItem>Integer</ListItem>
            <ListItem>Facilisis</ListItem>
          </UnorderedList>
        </VStack>
      </GridItem>

      <GridItem colSpan={2} rowSpan={2} bg="blanco">
        <VStack p={10} justify={"flex-start"} direction={"column"} align={"flex-start"}  >
          <Box
            color="green.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="4xl"
            alignSelf={"flex-start"}
          >
            Informacion Personal
          </Box>
          <Flex justify={"flex-start"} direction={"column"} align={"flex-start"} mt={15} p={10} borderRadius={6} border={'1px solid gray'} >
            <Text fontSize={20} >Nombre de usuario: {user?.username}</Text>
            <Text fontSize={20}>nombre: {user?.firstName ? user.firstName : 'John'}</Text>
            <Text fontSize={20}>Apellido: {user?.firstName ? user.lastName : 'Doe'}</Text>
            <Text fontSize={20}>Correo electronico: {user?.email}</Text>
            <Text fontSize={20}>Direccion {user?.address? user.address : 'Siempre viva 2345' }</Text>

          </Flex>
        </VStack>
      </GridItem>
      <GridItem colSpan={2} rowSpan={2} bg="papayawhip" />
      <GridItem colSpan={4} bg="tomato" />
    </Grid>
  );
};

export default Perfil;
