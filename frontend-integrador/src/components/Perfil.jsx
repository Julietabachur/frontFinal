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
  Heading,
  Image,
} from "@chakra-ui/react";
import LogoutButton from "./LogoutButton";
import { useProductContext } from "./pages/home/Global.context";
import ProductCardContainer from "./pages/home/ProductCardContainer";
import ProductCard from "./pages/home/ProductCard";
import { Link as ReactRouterLink } from "react-router-dom";

const Perfil = ({username, token }) => {
  const USER_URL = import.meta.env.VITE_USER_URL; //http://localhost:8080/api/v1/private/clients/search?
  const [user, setUser] = useState({});
  var { paginatedData } = useProductContext();
// paginatedData = [];
console.log('favs en perfil: ', paginatedData);
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
          <Text textAlign={"center"} color={"verde2"} fontSize={20}>
            {user?.clientName}
          </Text>
          {/* <Text textAlign={"center"}>{user?.email}</Text>
           */}
          <UnorderedList
            direction={{ base: "row", md: "column" }}
            listStyleType={"none"}
            m={0}
          >
            <ListItem textAlign={"center"}>Reservas</ListItem>
            <ListItem textAlign={"center"}>Editar Perfil</ListItem>
          </UnorderedList>
          <LogoutButton
            /* justifySelf={"center"}
            w={"130px"}
            bg={"red.400"}
            color={"blanco"}
            onClick={logoutHandle} */
          />
        </SimpleGrid>
      </GridItem>

      {/* datos personales */}
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
            color="verde2"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize={{ base: "2xl", md: "4xl" }}
            alignSelf={{ base: "center", md: "flex-start" }}
            /*textShadow={"10px 10px 10px gray"}*/
          >
            Información personal
          </Box>
          <Flex
           /* boxShadow={"15px 15px 15px gray"}*/
            justify={"flex-start"}
            direction={"column"}
            align={"flex-start"}
            w={"100%"}
            mt={15}
            borderRadius={6}
            /*border={"1px solid lightblue"}*/
          >
            <HStack>
              <Text fontSize={{ base: 15, md: 20 }} as='b'>
                Usuario: 
              </Text>
              <Text fontSize={{ base: 15, md: 20 }}>{user?.clientName}</Text>
            </HStack>
            <HStack>
              <Text fontSize={{ base: 15, md: 20 }} as='b'>
                Nombre: 
              </Text>
              <Text fontSize={{ base: 15, md: 20 }}>{user?.firstName ? user.firstName : "John"} {user?.lastName ? user.lastName : "Doe"}</Text>
            </HStack>
            {/* <Text fontSize={{ base: 15, md: 20 }}>
              Apellido: {user?.lastName ? user.lastName : "Doe"}
            </Text> */}
            <HStack>
              <Text fontSize={{ base: 15, md: 20 }} as='b'>
                Correo electronico:
              </Text>
              <Text fontSize={{ base: 15, md: 20 }}> {user?.email}</Text>
            </HStack>
            {/* <Stack> */}
              {/* <Divider m={3} />
              <Text fontSize={{ base: 20, md: 25 }} color={"verde1"}>
                Informarcion de Residencia
              </Text> */}
              <HStack>
                <Text fontSize={{ base: 15, md: 20 }} as='b'>
                  Dirección:{" "}                 
                </Text>
                <Text fontSize={{ base: 15, md: 20 }}> {user?.address
                    ? user.address.calle + user.address.number
                    : "Siempre viva 4354"}
                    </Text>
              </HStack>
              <HStack>

              <Text fontSize={{ base: 15, md: 20 }} as='b'>
                Ciudad: 
              </Text>
              <Text fontSize={{ base: 15, md: 20 }}>{user?.address ? user.address.city : "Montevideo"}</Text>
              </HStack>
              
              <HStack>
                <Text fontSize={{ base: 15, md: 20 }} as='b'>
                  País: 
                </Text>         
                <Text fontSize={{ base: 15, md: 20 }}>{user?.address ? user.address.country : "Uruguay"}</Text>    
              </HStack>
            {/* </Stack> */}
          </Flex>
        </VStack>
      </GridItem>

      {/* //favoritos */}
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
            color="verde2"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize={{ base: "2xl", md: "4xl" }}
            alignSelf={{ base: "center", md: "flex-start" }}
            /*textShadow={"10px 10px 10px gray"}*/
          >
            Mis favoritos
          </Box>
          <Flex
            /*boxShadow={"15px 15px 15px gray"}*/
            justify={"flex-start"}
            direction={"column"}
            align={"flex-start"}
            w={"100%"}
            mt={15}
            p={5}
            borderRadius={6}
            /*border={"1px solid lightblue"}*/
          >           
          {paginatedData.length == 0  &&
         <VStack>
           <Heading as='h6' size='s'>Tu lista de favoritos está vacía</Heading>
           
         </VStack>
       } 
            {paginatedData != 0 &&
            paginatedData.map((fav) => (
              <Link key={fav.id} as={ReactRouterLink} to={`/detalle/${fav.id}`}>
                <Box
                  key={fav.id}
                  w={'100%'}
                  h={['60px', '90px', '150px']}
                  textAlign="center"                
                >
                  <Box bg={"verde2"} w={'100%'} h={'100%'}>
                    <Image
                      w={'100%'}
                      h={'80%'}
                      objectFit={"cover"}
                      src={fav.thumbnail}
                      fallbackSrc="https://via.placeholder.com/150"
                    />
                    <Text fontSize={{ base: 10, lg: 18 }} color={"negro"}>{fav.productName}</Text>
                  </Box>
                </Box>
              </Link>
            ))}
          </Flex>
        </VStack>
      </GridItem>

      {/* //reservas */}
      <GridItem colSpan={{ base: 5, md: 4 }} bg="blanco" p={5}>
      <Box
            color="verde2"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize={{ base: "2xl", md: "4xl" }}
            alignSelf={{ base: "center", md: "flex-start" }}
            /*textShadow={"10px 10px 10px gray"}*/
          >
            Mis reservas
          </Box>
          <Heading as='h6' size='s'>Por el momento no tenés reservas</Heading>
      </GridItem>
    </Grid>
  );
};

export default Perfil;
