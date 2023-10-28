import React, { useState, useEffect, useCallback } from 'react';
import { Box, Input, Button, Stack, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const nameRegex = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/; {/* falta validacion nombre y apellido */}
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const REGISTER_URL = "http://localhost:8080/auth/register";



const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [clientName, setClientName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();
        
    //confirma si riskkojkt existe y si no va a home
    const token = JSON.parse(localStorage.getItem("riskkojwt"));
    
    const GETME_URL = import.meta.env.VITE_GETME_URL;

    const getUsername = async (token) => {
        try {
        const response = await axios.get(GETME_URL, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });
        if (response) {
            navigate("/")
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

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validar campos antes de continuar
        if (password !== confirmPassword) {
            setConfirmPasswordError('Las contraseñas no coinciden');
            return;
        } else {
            setConfirmPasswordError('');
        }

        if (!emailRegex.test(email)) {
            setEmailError('Formato de correo electrónico no válido');
            return;
        } else {
            setEmailError('');
        }

        if (!passwordRegex.test(password)) {
            setPasswordError('La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.');
            return;
        } else {
            setPasswordError('');
        }

        try {
            const response = await axios.post(REGISTER_URL, {
                firstName,
                lastName,
                clientName,
                email,
                password,
            });

            if (response.status === 200) {
                // Registro exitoso, puedes hacer algo aquí, por ejemplo, redirigir al usuario a la página de inicio de sesión
                navigate("/");
            } else {
                alert("Fallo el registro, recargue la pagina y pruebe nuevamente")
            }
        } catch (error) {
            // Maneja errores de la solicitud
            console.error("Error en el registro:", error);
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
                    <Input w="500px" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <Input w="500px" placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <Input w="500px" placeholder="Nombre de usuario" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    <Input w="500px" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <Box color="red">{emailError}</Box>}
                    <Input w="500px" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Input w="500px" placeholder="Confirmar Contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {passwordError && <Box color="red">{passwordError}</Box>}
                    {confirmPasswordError && <Box color="red">{confirmPasswordError}</Box>}
                    <Button w="500px" colorScheme="green" onClick={handleRegister}>Registrarse</Button>
                </Stack>
            </Box>
        </Flex>
    );
};

export default Register;
