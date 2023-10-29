import React, { useState } from 'react';
import { Box, Input, Button, Stack, Flex, Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = "http://localhost:8080/auth/login";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, {
                email,
                password,
            });

            if (response.status === 200) {
                // Inicio de sesión exitoso, redirección a la página home
                console.log("logueado")
                console.log(response.status)
                navigate("/");
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
            <Box pos={'relative'} top={100} w={'97vw'} h={'100vh'}>
                <Stack spacing={4} align="center" justify="center">
                    <Input w="500px" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input w="500px" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button w="500px" colorScheme="green" onClick={handleLogin}>Iniciar Sesión</Button>
                    {showAlert && invalidCredentials && ( 
                        <Alert status="error" w="500px" mt={4}>
                            <AlertIcon />
                            Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.
                        </Alert>
                    )}
                </Stack>
            </Box>
        </Flex>
    );
};

export default Login;
