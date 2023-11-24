import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Stack, VStack, Flex, Alert, AlertIcon, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = "http://localhost:8080/auth/login";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const [media, setMedia] = useState(false);
    const MIN_DESKTOP_WIDTH = 768;

    // Efecto para suscribirse al evento de redimensionamiento de la ventana
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < MIN_DESKTOP_WIDTH) {
                setMedia(true);
            } else {
                setMedia(false);
            }
        };
        if (window.innerWidth < MIN_DESKTOP_WIDTH) {
            setMedia(true);
        } else {
            setMedia(false);
        }

        window.addEventListener("resize", handleResize);

        // Limpieza del event listener cuando el componente se desmonta
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [window.innerWidth]);

    //confirma si riskkojkt existe es que la pesona ya esta registrado y si no va a home
    const token = JSON.parse(localStorage.getItem("riskkojwt"));
    //console.log(token)

    const GETME_URL = import.meta.env.VITE_GETME_URL;

    const getUsername = async (token) => {
        try {
            const response = await axios.get(GETME_URL, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            //console.log(response);
            console.log("Username Verified: ", response.data.isVerified);

            if (response) {
                if (response.data.isVerified === "true") {
                    navigate("/");
                } else {
                    navigate("/verify");
                }
            } else {
                localStorage.removeItem("riskkojwt");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        if (token) {
            getUsername(token);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, {
                email,
                password,
            });

            if (response.status === 200) {
                // Inicio de sesión exitoso, guarda token y redirección a la página home

                localStorage.setItem('riskkojwt', JSON.stringify(response.data.token))

                //console.log("logueado")
                //console.log(response.data)

                //console.log("HandleLogin Verified: ", response.data.isVerified);

                if (response.data.isVerified === "true") {
                    console.log("Usuario verificado");

                    let isAdmin = false;

                    response.data.roles.forEach((rol) => {
                        if (rol === "ADMIN") {
                            isAdmin = true;
                        }
                    });

                    if (isAdmin) {
                        navigate("/");
                        // navigate("/admin"); // esta opcion permite direccionar al panel administrador si detecta ese rol.
                    } else {
                        navigate("/");
                    }

                } else {
                    console.log("Usuario no verificado");
                    navigate("/verify");
                }


                //window.location.reload()
            } else {
                // Maneja otros escenarios de respuesta según tu API
                console.error("Inicio de sesión fallido");
                console.log(response.config.data);
                console.log(response.status);
            }
        } catch (error) {
            // Maneja errores de la solicitud
            if (error.response && error.response.status === 400) {
                // El servidor respondió con un código de estado 400 (No autorizado)
                setInvalidCredentials(true);
                setShowAlert(true); // Muestra la alerta cuando las credenciales son incorrectas
                console.error("Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.");
            } else {
                // Otros errores de solicitud
                console.error("Error en el inicio de sesión:", error);
            }
        }


    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            minH="100vh"
            p={4}
        >
            {media ?
                (
                    <Box pos={'relative'} top={10} w={'97vw'} h={'100vh'}>
                        <Text fontSize='2xl' align='center' py={3}>Iniciar sesión</Text>
                        <Stack spacing={4} align="center" justify="center">
                            <Input w="250px" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input w="250px" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button w="200px" bg={"verde2"} onClick={handleLogin}>Iniciar Sesión</Button>
                            {showAlert && invalidCredentials && (
                                <Alert status="error" w="300px" mt={4}>
                                    <VStack>
                                        <AlertIcon />
                                        <p align='center'>Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.</p>
                                    </VStack>
                                </Alert>
                            )}
                        </Stack>
                    </Box>
                )
                :
                (
                    <Box pos={'relative'} top={10} w={'97vw'} h={'100vh'}>
                        <Text fontSize='4xl' align='center' py={3}>Iniciar sesión</Text>
                        <Stack spacing={4} align="center" justify="center">
                            <Input w="500px" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input w="500px" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button w="500px" bg={"verde2"} onClick={handleLogin}>Iniciar Sesión</Button>
                            {showAlert && invalidCredentials && (
                                <Alert status="error" w="500px" mt={4}>
                                    <AlertIcon />
                                    Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.
                                </Alert>
                            )}
                        </Stack>
                    </Box>
                )
            }

        </Flex>
    );
};

export default Login;
