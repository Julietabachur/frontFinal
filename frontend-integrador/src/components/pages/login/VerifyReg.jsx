import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import {
    Alert,
    AlertIcon,
    Button,
    Center,
    Box,
    Spinner,
    Flex,
    Heading,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";

const VerifyReg = () => {

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const authUrl = import.meta.env.VITE_AUTH_URL;
    const frontUrl = import.meta.env.VITE_FRONT_URL;
    const GETME_URL = import.meta.env.VITE_GETME_URL;


    const [showSentMail, setShowSentMail] = useState(false);
    const [mailSent, setMailSent] = useState(1);
    const [userId, setUserId] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userDataReady, setUserDataReady] = useState(false);
    const [requestSendMail, setRequestSendMail] = useState(false);
    const token = JSON.parse(localStorage.getItem("riskkojwt"));
    const navigate = useNavigate();
    const [showVerified, setShowVerified] = useState(false);



    const location = useLocation();
    const parameters = new URLSearchParams(location.search);

    const mailToken = parameters.get('mailToken');
    const verifyToken = parameters.get('verifyToken');


    console.log("VerifyToken: ", verifyToken);
    console.log("MailToken: ", mailToken);
    console.log("LocalS-Token: ", token);


    // primero verificar si hay un token en LocalStorage, si es asi verificar si ese usuario ya verificó.

    // si en cambio se recibe por parametro el verifyToken, proceder a verificar usuario en VerifyMail.

    useEffect(() => {

        checkUser(token);
    }, []);



    // en el caso que haya token en LocalStorage verificar usuario y darle acceso.
    const checkUser = async (token) => {
        console.log("CHECK USER");


        if (token) {

            try {
                const response = await axios.get(GETME_URL, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserId(response.data.id); // guarda el ID e email del usuario para usarlo luego.
                setUserEmail(response.data.email);
                setUserDataReady(true); // Marcar que los datos del usuario ya están disponibles.

                if (response.data.isVerified === "true") {
                    console.log("isVerified: YES");
                    navigate("/");
                } else {
                    console.log("isVerified: NO");
                    setRequestSendMail(true);

                }
            } catch (error) {
                console.error("ERROR en checkUser:", error);
            }
        }

        if (verifyToken) {
            verifyMail(verifyToken);
        }

    };



    const verifyMail = async (verifyToken) => {


        console.log("Actualizando Usuario - verifyMail");
        console.log(verifyToken);

        // Realiza la llamada a la API con los datos obtenidos
        try {
            const response = await axios.put(
                `${authUrl}/verifyToken/${verifyToken}`,
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
                setTimeout(() => {
                    navigate("/");
                }, 3000);

            }

        } catch (error) {
            console.error("ERROR verify directo MAIL:", error);

            // si el usuario ya está verificado pero entro al link sin haber antes iniciado sesión
            // entonces aparece un alerta avisando que ya está verificado pero que debe ingresar.
            // y lo redirige a la pagina de login.
            if (error.response.status == 500 && !token) {
                alert(error.response.data);
                navigate("/login");
            }
        }
    };

    // Utiliza otro useEffect para controlar el envío de emails
    useEffect(() => {
        if (userDataReady && requestSendMail) {
            mailSender();
        }
    }, [userDataReady, requestSendMail]);


    const mailSender = async () => {

        if (mailToken) {

            const verifyUrl = "/verifyReg?verifyToken=" + mailToken;
            console.log("MAIL SENDER")
            //console.log("******************");

            const resendBody = {
                id: `${userId}`,
                front_url: `${frontUrl}`,
                verify_url: `${verifyUrl}`,
            };
            //console.log(resendBody);
            //console.log("******************");

            if (mailSent != "E") {
                try {
                    const response = await axios.post(
                        `${baseUrl}/api/v1/private/email/`,
                        resendBody, // Cuerpo de la solicitud (contiene id del usuario y path de verificación)
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200) {
                        console.log("Mail ENVIADO");
                        setUserEmail(response.data);
                        setShowSentMail(true);
                        // cuenta tres segundos y vuelve a false
                        setTimeout(() => {
                            setShowSentMail(false);
                        }, 3000);

                        if (mailSent != "E") {
                            setMailSent((prevMailSent) => prevMailSent + 1);

                            if (mailSent > 3) {
                                setMailSent("E");
                            }
                        }
                    }
                } catch (error) {
                    console.error("ERROR en envío de e-mail:", error);
                }

                setRequestSendMail(false); // cambia el estado para resetear la variable.
            }

        }
    };

    const handleResend = () => {
        console.log("CLICK Resend");
        console.log("==================");

        mailSender();
    }

    return (
        <>
            <Flex direction="column" align="center" justify="center" p={4}>

                {!verifyToken && !mailToken ? (
                    <Alert
                        status="warning"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        borderRadius="md"
                        boxShadow="md"
                        w="60vw"
                        p={8}
                    >
                        <AlertIcon boxSize={8} />

                        <Text>Se accedió a esta página de forma errónea.</Text>
                        <Text>Intente nuevamente o contácte al administrador del sitio.</Text>

                    </Alert>
                ) : (
                    <>


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

                                    <Text><br /><br /></Text>

                                    <Spinner
                                        thickness='3px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        color='green.500'
                                        size='lg'
                                    />
                                    <Text>Esperando Verificación... </Text>
                                    <Text>Hacé click en el link de verificación que le enviamos por correo. </Text>
                                    <Text><br /></Text>
                                    <Text>
                                        Si necesitas que lo enviemos nuevamente, hacé click en "Reenviar Mail".<br />
                                        <Button onClick={() => handleResend()} mt={4}>
                                            Reenviar Mail
                                        </Button>
                                    </Text>

                                </>
                            )}

                            {showSentMail && (
                                <VStack>
                                    <Alert status="info">
                                        <AlertIcon />
                                        <Text>Email enviado a: {userEmail}</Text>
                                    </Alert>
                                    <Text></Text>
                                </VStack>
                            )}

                            {mailSent === "E" && (
                                <VStack>
                                    <Alert status="error">
                                        <AlertIcon />
                                        <Text>
                                            Ha intentado reenviar el e-mail muchas veces, contacte al
                                            administrador.
                                        </Text>
                                    </Alert>
                                    <Text></Text>
                                </VStack>
                            )}

                        </Box>


                    </>
                )}



            </Flex>
        </>
    );




}

export default VerifyReg;