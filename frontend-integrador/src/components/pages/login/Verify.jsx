import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  Alert,
  AlertIcon,
  Button,
  Stack,
  Text,
  Center,
} from "@chakra-ui/react";

const Verify = () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const GETME_URL = import.meta.env.VITE_GETME_URL;
  const loginUrl = import.meta.env.VITE_LOGIN_URL;
  const [showVerify, setShowVerify] = useState(false);
  const [showSentMail, setShowSentMail] = useState(false);
  const [mailSent, setMailSent] = useState(1);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDataReady, setUserDataReady] = useState(false);
  const [requestSendMail, setRequestSendMail] = useState(false);

  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  //console.log("Token LocalStorage:", token);

  const navigate = useNavigate();

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

      if (response.data.isVerified === "true") {
        console.log("isVerified: YES");
        navigate("/");
      } else {
        console.log("isVerified: NO");
        setShowVerify(true);
        setRequestSendMail(true);
        //setShowSentMail(false);
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
          `${baseUrl}/api/v1/private/clients/${userId}`,
          { isVerified: "true" },  // Cuerpo de la solicitud 
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
      console.log("==================");

      mailSender();
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
  };

  return (
    <>
      {showVerify && (
        <Alert
          status="warning"
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
              Recibiste nuestro e-mail de confirmación? <br/> Si es así, por favor
              confírmalo con un clic.<br/>
              <Button onClick={() => handleVerification("ok")} mt={4}>
                Recibido OK
              </Button>
            </Text>
            <Text>
              Si necesitas que lo reenviemos, haz clic en "Reenviar Mail".<br/>
              <Button onClick={() => handleVerification("resend")} mt={4}>
                Reenviar Mail
              </Button>
            </Text>
          </Stack>
        </Alert>
      )}

      {showSentMail && (
        <Alert status="info">
          <AlertIcon />
          <Text>Email enviado a: {userEmail}</Text>
        </Alert>
      )}

      {mailSent === "E" && (
        <Alert status="error">
          <AlertIcon />
          <Text>
            Ha intentado reenviar el e-mail muchas veces, contacte al
            administrador.
          </Text>
        </Alert>
      )}
    </>
  );

};

export default Verify;
