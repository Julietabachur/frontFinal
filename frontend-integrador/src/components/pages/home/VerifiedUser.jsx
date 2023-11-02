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
    const [userId, setUserId] = useState('');

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

        setUserId(response.data.id);  // guarda el ID del usuario para usarlo luego en el axios.put de isVerified.

        if (response.data.isVerified) {
            console.log("isVerified: YES");
            setShowVerify(false);
        } else {
            
            console.log("isVerified: NO")
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
        }
    };
    

    return (

        <> { showVerify && (
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
        </>

    );

  };

  export default VerifiedUser;