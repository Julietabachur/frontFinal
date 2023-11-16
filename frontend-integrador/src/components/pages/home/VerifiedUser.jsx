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
  const loginUrl = import.meta.env.VITE_LOGIN_URL;
  const [showVerify, setShowVerify] = useState(false);
  const [showSentMail, setShowSentMail] = useState(false);
  const [mailSent, setMailSent] = useState(0);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDataReady, setUserDataReady] = useState(false);
  const [requestSendMail, setRequestSendMail] = useState(false);

  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  //console.log("Token LocalStorage:", token);

  useEffect(() => {
    if (token) {
      checkUser(token);
    }
  }, []);

  const checkUser = async (token) => {
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

      if (response.data.isVerified) {
        console.log("isVerified: YES");
      } else {
        console.log("isVerified: NO");
        setShowVerify(true);
        setRequestSendMail(true);
      }
    } catch (error) {
      console.error("ERROR en checkUser:", error);
    }
  };

  // Utiliza otro useEffect para controlar el envío de emails
  useEffect(() => {
    if (userDataReady && requestSendMail) {
      mailSender();
    }
  }, [userDataReady, requestSendMail]);

  const handleVerification = async (e) => {
    if (e === "ok") {
      console.log("CLICK OK");

      try {
        const response = await axios.put(
          `${baseUrl}/api/v1/private/clients/chk/${userId}`,
          null, // Cuerpo de la solicitud (en este caso, nulo el back cambia a isVerified=true)
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.verified) {
          console.log("isVerified: YES");
          setShowVerify(false);
          setMailSent("");
        }
      } catch (error) {
        console.error("ERROR en Update isVerified:", error);
      }
    }

    if (e === "resend") {
      console.log("CLICK Resend");
      console.log("==================");

      mailSender();
    }
  };

            if (response.data.isVerified) {
                console.log("isVerified: YES");
            } else {
                console.log("isVerified: NO");
                setShowVerify(true);
                setRequestSendMail(true);
                setShowSentMail(false);
            }
        } catch (error) {
            console.error("ERROR en checkUser:", error);
        }

    const resendBody = {
      id: `${userId}`,
      login_url: `${loginUrl}`,
    };
    console.log(resendBody);
    console.log("******************");

    if (mailSent != "E") {
      try {
        const response = await axios.post(
          `${baseUrl}/api/v1/private/email/`,
          resendBody, // Cuerpo de la solicitud (contiene id del usuario y path del server)
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

            if (mailSent >= 5) {
              setMailSent("E");
            }
          }
        }
      } catch (error) {
        console.error("ERROR en envío de e-mail:", error);
      }

        if (e === "resend") {
            console.log("CLICK Resend");
            console.log("==================");

            mailSender();

        }
    };


    const mailSender = async () => {

        console.log("MAIL SENDER")
        console.log("******************");
        console.log("Times Sent: ", mailSent);
        console.log("******************");

        const resendBody = {
            id: `${userId}`,
            login_url: `${loginUrl}`
        };
        console.log(resendBody);
        console.log("******************");

        if (mailSent != "E") {
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

                    if (mailSent != "E") {
                        setMailSent(prevMailSent => prevMailSent + 1);

                        if (mailSent >= 5) {
                            setMailSent('E');
                        }
                    }
                }

            } catch (error) {
                console.error("ERROR en envío de e-mail:", error);
            }

            setRequestSendMail(false); // cambia el estado para resetear la variable.
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
            {showSentMail && mailSent > 0 && mailSent <= 5 ? (
                <Alert status="info">
                    <AlertIcon />
                    <Text>Email enviado a: {userEmail}</Text>
                </Alert>
            ) : showSentMail && mailSent === 'E' && (
                <Alert status="error">
                    <AlertIcon />
                    <Text>Ha intentado reenviar el e-mail muchas veces, contacte al administrador.</Text>
                </Alert>
            )}
        </>

    );

  return (
    <>
      {" "}
      {showVerify && (
        <Alert status="warning">
          <AlertIcon />
          <Stack>
            <Text fontSize={18}>
              Recibiste nuestro e-mail de confirmación? Si es así por favor
              confirmalo con un click.
              <Button onClick={() => handleVerification("ok")}>
                Recibido OK
              </Button>
            </Text>
            <Text>
              Si necesitas que volvamos a enviarlo, clickea en Reenviar Mail.
              <Button onClick={() => handleVerification("resend")}>
                Reenviar Mail
              </Button>
            </Text>
          </Stack>
        </Alert>
      )}
      {mailSent > 0 && mailSent <= 5 ? (
        <Alert status="info">
          <AlertIcon />
          <Text>Email enviado a: {userEmail}</Text>
        </Alert>
      ) : (
        mailSent === "E" && (
          <Alert status="error">
            <AlertIcon />
            <Text>
              Ha intentado reenviar el e-mail muchas veces, contacte al
              administrador.
            </Text>
          </Alert>
        )
      )}
    </>
  );
};

export default VerifiedUser;
