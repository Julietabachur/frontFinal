import React, { useState } from 'react';
import { Box, Input, Button, Stack, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const nameRegex = /^[a-zA-Z][a-zA-Z_-]{2,22}$/; 
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
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const navigate = useNavigate();


    
    const handleBlur = (field) => {
        switch (field) {
            case 'firstName':
                setErrors(prevErrors => ({ ...prevErrors, firstName: !nameRegex.test(firstName) ? 'El nombre debe contener solo letras, mínimo 4 y no tener espacios al inicio.' : '' }));
                break;
            case 'lastName':
                setErrors(prevErrors => ({ ...prevErrors, lastName: !nameRegex.test(lastName) ? 'El apellido debe contener solo letras, mínimo 4 y no tener espacios al inicio.' : '' }));
                break;
            case 'email':
                setErrors(prevErrors => ({ ...prevErrors, email: !emailRegex.test(email) ? 'Formato de correo electrónico no válido.' : '' }));
                break;
            case 'password':
                setErrors(prevErrors => ({ ...prevErrors, password: !passwordRegex.test(password) ? 'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.' : '' }));
                break;
            case 'confirmPassword':
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: password !== confirmPassword ? 'Las contraseñas no coinciden.' : '' }));
                break;
            default:
                break;
        }
    };

    //confirma si riskkojkt existe es que la pesona ya esta registrado y si no va a home
    const token = JSON.parse(localStorage.getItem("riskkojwt"));
    console.log(token)
    
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

   /* useEffect(() => {
        if (token) {
        getUsername(token);
        }
    }, []);*/

    //Logica para el handle register

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validar campos antes de continuar
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !emailRegex.test(email) || !passwordRegex.test(password) || password !== confirmPassword) {
            // Mostrar mensajes de error para los campos inválidos
            return;
        }

        try {
            // Lógica para enviar el formulario
            const response = await axios.post(REGISTER_URL, {
                firstName,
                lastName,
                clientName,
                email,
                password,
            });

            if (response.status === 200) {
                window.alert('Registro exitoso. Serás redirigido a la página de inicio.');
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                alert("Fallo el registro, recargue la pagina y pruebe nuevamente")
            }
        } catch (error) {
            // Manejar errores de la solicitud
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
                    <Input 
                        w="500px" 
                        placeholder="Nombre" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                    />
                    {errors.firstName && <Box color="red">{errors.firstName}</Box>}
                    
                    <Input 
                        w="500px" 
                        placeholder="Apellido" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                    />
                    {errors.lastName && <Box color="red">{errors.lastName}</Box>}

                    <Input 
                        w="500px" 
                        placeholder="Nombre de usuario" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)}
                    />
                    {/* Validaciones y mensajes de error para otros campos */}

                    <Input 
                        w="500px" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                    />
                    {errors.email && <Box color="red">{errors.email}</Box>}

                    <Input 
                        w="500px" 
                        placeholder="Contraseña" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                    />
                    {errors.password && <Box color="red">{errors.password}</Box>}

                    <Input 
                        w="500px" 
                        placeholder="Confirmar Contraseña" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                    />
                    {errors.confirmPassword && <Box color="red">{errors.confirmPassword}</Box>}

                    <Button w="500px" colorScheme="green" onClick={handleRegister}>Registrarse</Button>
                </Stack>
            </Box>
        </Flex>
    );
};

export default Register;
