import { useState, useEffect } from "react";
import axios from "axios";
import {
    Alert,
    AlertIcon,
    Button,
    Stack,
    Text,
    Center,
} from "@chakra-ui/react";

const VerifiedUser = () => {
    console.log("Inicio checkUser");

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const GETME_URL = import.meta.env.VITE_GETME_URL;
    const [showVerify, setShowVerify] = useState(true);
    const [mailSent, setMailSent] = useState('0');
    const [userId, setUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDataReady, setUserDataReady] = useState(false);
    const [requestSendMail, setRequestSendMail] = useState(false);

    const token = JSON.parse(localStorage.getItem("riskkojwt"));
    console.log("Token LocalStorage:", token);

    const checkUser = async (token) => {
        try {
            const response = await axios.get(GETME_URL, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserId(response.data.id);  // guarda el ID e email del usuario para usarlo luego.
            setUserEmail(response.data.email);
            setUserDataReady(true); // Marcar que los datos del usuario ya están disponibles.

            if (response.data.isVerified) {
                console.log("isVerified: YES");
                setShowVerify(false);

            } else {

                console.log("isVerified: NO")
                setRequestSendMail(true);

            }
        } catch (error) {
            console.error("ERROR en checkUser:", error);
        }

    };

    useEffect(() => {
        if (token) {
            checkUser(token);
        }
    }, []);

    // Utiliza otro useEffect para controlar el envío de emails
    useEffect(() => {
        if (userDataReady && requestSendMail) {

            mailSender();
        }
    }, [userDataReady, requestSendMail]);


    const handleVerification = async (e) => {
        if (e === "ok") {
            console.log("CLICK OK");
            console.log("USER ID", userId);
            console.log("TOKEN", token);

            try {
                const response = await axios.put(
                    `${baseUrl}/api/v1/private/clients/chk/${userId}`,
                    null,  // Cuerpo de la solicitud (en este caso, nulo el back cambia a isVerified=true)
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.isVerified) {
                    console.log("isVerified: YES");
                    setShowVerify(false);
                }

            } catch (error) {
                console.error("ERROR en Update isVerified:", error);
            }
        }

        if (e === "resend") {
            console.log("CLICK Resend");
            console.log("==================");
            console.log("USER ID", userId);
            console.log("TOKEN", token);
            console.log("Resend Times: ", mailSent);
            console.log("******************");

            mailSender();

        }
    };


    const mailSender = async () => {

        setRequestSendMail(false); // cambia el estado para resetear la variable.

        console.log("MAIL SENDER")
        console.log("******************");
        console.log("USER ID", userId);
        console.log("TOKEN", token);
        console.log("Times Sent: ", mailSent);
        console.log("******************");
        console.log("POST: ", baseUrl + "/api/v1/private/email/" + userId)
        console.log("******************");

        const resendBody = {
            id: `${userId}`,
            server_url: `${baseUrl}/api/v1/private/email/`
        };
        console.log(resendBody);
        console.log("******************");

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

            if (response.data) {
                console.log("Mail ENVIADO");
                setMailSent(mailSent + 1);
                if (mailSent > 5) {
                    setMailSent('E');
                }

            }

        } catch (error) {
            console.error("ERROR en envío de e-mail:", error);
        }

    };


    return (

        <> {showVerify && (
            <Alert status='warning'>
                <AlertIcon />
                <Stack>
                    <Text fontSize={18}>Recibiste nuestro e-mail de confirmación? Si es así por favor confirmalo con un click.
                        <Button onClick={() => handleVerification("ok")}>Recibido OK</Button></Text>
                    <Text>Si necesitas que volvamos a enviarlo, clickea en Reenviar Mail.
                        <Button onClick={() => handleVerification("resend")}>Reenviar Mail</Button></Text>
                </Stack>
            </Alert>
        )}
            {mailSent > 0 && mailSent <= 5 ? (
                <Alert status="info">
                    <AlertIcon />
                    <Text>Email enviado a: {$userEmail}</Text>
                </Alert>
            ) : mailSent === 'E' && (
                <Alert status="error">
                    <AlertIcon />
                    <Text>Ha intentado reenviar el e-mail muchas veces, contacte al administrador.</Text>
                </Alert>
            )}
        </>

    );

};

export default VerifiedUser;