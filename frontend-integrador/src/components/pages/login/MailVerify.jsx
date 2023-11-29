import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import {
    Alert,
    AlertIcon,
    Box,
    Spinner,
    Flex,
    Heading,
    Stack,
    Text,
} from "@chakra-ui/react";

const MailVerify = () => {

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const GETME_URL = import.meta.env.VITE_GETME_URL;
    //const [userIdQuery, setUserIdQuery] = useState("");
    //const { encodedEmail, userIdQuery } = useParams();
    const {verifyToken} = useParams();
    const [userId, setUserId] = useState("");
    //const [token, setToken] = useState("");
    const [showVerified, setShowVerified] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        // Obtiene la URL actual
        //const currentUrl = window.location.href;

        // Obtiene el objeto URL para poder acceder a los parámetros
        //const url = new URL(currentUrl);
        //const clave1 = url.pathname.split('/')[2];

        //console.log("URL: ", url);
        //console.log("Clave1: ", clave1);
        //console.log("Email: ", encodedEmail);
        //console.log("UserID: ", userIdQuery);
        console.log("verifyToken: ", verifyToken);

        // Obtiene los parámetros de la URL
        //setUserIdQuery(url.pathname.split('/')[2]);
        //setToken(url.pathname.split('/')[3]);
        //const email = decodeURIComponent(encodedEmail);
        //console.log("Email Decoded", email);

        //checkUser(email, userIdQuery);
        verifyMail(verifyToken);

    }, []);


    const checkUser = async (email, userIdQuery) => {
        try {
            const response = await axios.get(
                `${baseUrl}/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
    
                },
            });

            setUserId(response.data.id); // guarda el ID e email del usuario para usarlo luego.


            if (response.data.id === userIdQuery) {
                console.log("Usuario Encontrado");
                verifyMail(email, userId);
            } else {
                console.log("Datos Usuario NO coinciden");
            }

        } catch (error) {
            console.error("ERROR en checkUser:", error);
        }

    };

    const verifyMail = async (verifyToken) => {

        console.log("Actualizando Usuario - verifyMail");
        console.log(verifyToken);

        // Realiza la llamada a la API con los datos obtenidos
        try {
            const response = await axios.put(
                `${baseUrl}/auth/verifyToken/${verifyToken}`,
                { "isVerified": "true" },  // Cuerpo de la solicitud 
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            if (response.data.client.isVerified === "true") {
                console.log("MAIL isVerified: ", response.data.client.isVerified);

                setShowVerified(true);
                // guarda el token en localStorage para habilitar al usuario.
                localStorage.setItem("riskkojwt", JSON.stringify(response.data.token));

                // agregar un delay y luego que redirija al home
                const timeoutId = setTimeout(() => {
                    navigate("/");
                  }, 3000);
                
            }

        } catch (error) {
            console.error("ERROR verify directo MAIL:", error);
        }
    };

    return (
        <>
            <Flex direction="column" align="center" justify="center" p={4}>

                <Box align='center' border='1px' w="60vw" borderRadius={15} minH={200}>
                    <Heading size='lg'>
                        Verificación de e-mail.
                    </Heading>


                    {showVerified ? (
                        <Alert
                            status="success"
                            variant="subtle"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                            borderRadius="md"
                            boxShadow="md"
                            p={8}
                        >
                            <AlertIcon boxSize={8} />
                            <Stack spacing={4}>
                                <Text fontSize={18}>
                                    Mail verificado correctamente! <br />
                                    En breve accederás a la pagina de inicio.

                                </Text>
                            </Stack>
                        </Alert>
                    ) : (
                        <>

                        <Text><br/><br/></Text>

                            <Spinner
                                thickness='3px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='green.500'
                                size='lg'
                            />
                            <Text>Verificando... </Text>


                        </>


                    )}
                </Box>
            </Flex>
        </>
    );

};

export default MailVerify;