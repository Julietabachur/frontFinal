import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
    Alert,
    AlertIcon,
    Flex,
    Button,
    Stack,
    Text,
    Box,
} from "@chakra-ui/react";

const Verify = () => {


    console.log("Inicio Verify");

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const GETME_URL = import.meta.env.VITE_GETME_URL;
    const loginUrl = import.meta.env.VITE_LOGIN_URL;
    const [showVerify, setShowVerify] = useState(false);
    const [showSentMail, setShowSentMail] = useState(false);
    const [mailSent, setMailSent] = useState(1);
    const [userId, setUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDataReady, setUserDataReady] = useState(false);
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("riskkojwt"));
    //console.log("Token LocalStorage:", token);

    useEffect(() => {
        if (token) {
            checkUser(token);
        }
    }, []);

    const checkUser = async (token) => {
        try {
            console.log("Check User TRY");
            const response = await axios.get(GETME_URL, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserId(response.data.id);  // guarda el ID e email del usuario para usarlo luego.
            setUserEmail(response.data.email);
            setUserDataReady(true); // Marcar que los datos del usuario ya están disponibles.

            if (response.data.isVerified === "true") {
                console.log("isVerified: YES");
                navigate("/");
            } else {
                console.log("isVerified: NO");
                setShowVerify(true);
                setShowSentMail(false);
              }
        } catch (error) {
            console.error("ERROR en checkUser:", error);
        }

    };

    useEffect(() => {
      if (userDataReady) {
        mailSender();
      }

    }, [userDataReady]);
    


    const handleVerification = async (e) => {
        if (e === "ok") {
            console.log("CLICK OK");

            try {
                console.log("Handle Verification TRY");
                const response = await axios.put(
                    `${baseUrl}/api/v1/private/clients/${userId}`,
                    {isVerified:"true"},  // Cuerpo de la solicitud 
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data.isVerified === "true") {
                    console.log("isVerified: ", response.data.isVerified);
                    //console.log(response.data);
                    
                    setShowVerify(false);
                    setMailSent("");
                    navigate("/");
                }

            } catch (error) {
                console.error("ERROR en Update isVerified:", error);
            }
        }

        if (e === "resend") {
            console.log("CLICK Resend");

            if (mailSent != "E") {

                setMailSent(prevMailSent => prevMailSent + 1);

                mailSender();



                if (mailSent > 3) {
                    setMailSent('E');
                }
            }

            //console.log("******************");
            //console.log("Times Sent: ", mailSent);
            //console.log("******************");




        }
    };


    const mailSender = async () => {

        console.log("MAIL SENDER")
        //console.log("******************");

        const resendBody = {
            id: `${userId}`,
            login_url: `${loginUrl}`
        };
        //console.log(resendBody);
        //console.log("******************");

            try {
                const response = await axios.post(
                    `${baseUrl}/api/v1/private/email/`,
                    resendBody,  // Cuerpo de la solicitud (contiene id del usuario y path del server)
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
                }

            } catch (error) {
                console.error("ERROR en envío de e-mail:", error);
            }
        
    };


    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            minH="50vh"
            p={4}
        >
            {showVerify && (
                <Box>

                    <Stack>
                        <Text fontSize={18}>Recibiste nuestro e-mail de confirmación? Si es así por favor confirmalo con un click.
                            <Button onClick={() => handleVerification("ok")}>Recibido OK</Button></Text>
                        <Text>Si necesitas que volvamos a enviarlo, clickea en Reenviar Mail.
                            <Button onClick={() => handleVerification("resend")}>Reenviar Mail</Button></Text>
                    </Stack>
                </Box>
            )}
            {showSentMail && mailSent > 0 && mailSent <= 3 ? (
                <Alert status="info" width={450}>
                    <AlertIcon/>

                    <Text>Email enviado a: {userEmail}</Text>
                </Alert>
            ) : mailSent === 'E' && (
                <Box>

                    <Text>Ha intentado reenviar el e-mail muchas veces, contacte al administrador.</Text>
                </Box>
            )}

        </Flex>


    );

};

export default Verify;