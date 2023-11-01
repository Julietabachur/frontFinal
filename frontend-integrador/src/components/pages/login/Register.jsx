import React, { useState, useEffect} from 'react';
import { Box, Input, Button, Stack, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const nameRegex = /^[a-zA-Z][a-zA-Z_-]{2,22}$/;
const clientNameRegex = /^[a-zA-Z0-9_]{5,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const REGISTER_URL = "http://localhost:8080/auth/register";

const Register = () => {
    //constantes del formulario
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientNameValid, setClientNameValid] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //constantes para manejo de errores en las validaciones
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [clientNameError, setClientNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    //constantes para manejo de errores cdo se valida duplicado en BE de clientName y email
    const [showClientNameDuplicatedError, setShowClientNameDuplicatedError] = useState(false);
    const [showEmailDuplicatedError, setShowEmailDuplicatedError] = useState(false);

    const navigate = useNavigate();

    //Funciones de cada validación
    const validateName = (name) => {
        return !nameRegex.test(name) ? 'El nombre debe contener solo letras, mínimo 4 y no tener espacios al inicio.' : '';
    };

    const validateLastName = (lastName) => {
        return !nameRegex.test(lastName) ? 'El apellido debe contener solo letras, mínimo 4 y no tener espacios al inicio.' : '';
    };

    const validateClientName = (clientName)=> {
        return !clientNameRegex.test(clientName) ? 'El nombre de usuario puede contener letras, numeros y guión bajo, mínimo 5 y no tener espacios al inicio.' : '';
    };

    const validateEmail = (email) => {
        return !emailRegex.test(email) ? 'Formato de correo electrónico no válido.' : '';
    };

    const validatePassword = (password) => {
        return !passwordRegex.test(password) ? 'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.' : '';
    };

    //Funciones para el manejo de errores en dependencia de las validaciones

    const handleFirstNameBlur = () => {
        setFirstNameError(validateName(firstName));
    };

    const handleLastNameBlur = () => {
        setLastNameError(validateLastName(lastName));
    };

    const handleClientNameBlur = () => {
        setClientNameError(validateClientName(clientName));
    };
    

    const handleEmailBlur = () => {
        setEmailError(validateEmail(email));
    };

    const handlePasswordBlur = () => {
        setPasswordError(validatePassword(password));
    };

    const handleConfirmPasswordBlur = () => {
        setConfirmPasswordError(password !== confirmPassword ? 'Las contraseñas no coinciden.' : '');
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

   useEffect(() => {
        if (token) {
        getUsername(token);
        }
    }, []);

    //función para revisar si el clientName existe en el BE
    const checkClientName = async (name) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/auth/clientName?clientName=${name}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setClientNameValid(response.data); //devuelve un booleano true (si no esta duplicado, o sea No exsite)
            if (response.data) {
                setClientName(name); // guarda en clientName el que viene del onChange (e.target.value)
                setShowClientNameDuplicatedError(false); // Restablecer el estado de error cuando la validación es exitosa
            }
        } catch (error) {
            console.error("Error al hacer la solicitud GET:", error);
            setClientNameValid(false);
            setShowClientNameDuplicatedError(true);
        }
    };
    
  //version demorada de del metodo checkName
    const debouncedCheckClientName = debounce(checkClientName, 2000);

    //función para el Register similiar al onSubmit 

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validar campos antes de continuar
        setFirstNameError(validateName(firstName));
        setLastNameError(validateLastName(lastName));
        setClientNameError(validateClientName(clientName));
        setEmailError(validateEmail(email));
        setPasswordError(validatePassword(password));
        setConfirmPasswordError(password !== confirmPassword ? 'Las contraseñas no coinciden.' : '');

        if (firstNameError || lastNameError || clientName || emailError || passwordError || confirmPasswordError) {
            //esto es para mostrar en consola el error en que campo es
            if (firstNameError) console.error(`- Nombre: ${firstNameError}`);
            if (lastNameError) console.error(`- Apellido: ${lastNameError}`);
            if (clientNameError) console.error(`- Nombre de cliente: ${clientNameError}`);
            if (emailError) console.error(`- Email: ${emailError}`);
            if (passwordError) console.error(`- Contraseña: ${passwordError}`);
            if (confirmPasswordError) console.error(`- Confirmación de contraseña: ${confirmPasswordError}`);
            // Evitar que el formulario se envíe
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
                console.log(response.data);
                localStorage.setItem('riskkojwt', JSON.stringify(response.data.token))
                window.alert('Registro exitoso. Serás redirigido a la página de inicio.');
                setTimeout(() => {
                    navigate("/");
                    window.location.reload()
                }, 1000);
            } else {
                alert("Fallo el registro, recargue la página y pruebe nuevamente")
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
                        onBlur={handleFirstNameBlur}
                    />
                    {showClientNameDuplicatedError && <Box color="red">El nombre de usuario ya está en uso. Por favor, elige otro.</Box>}
                    {firstNameError && <Box color="red">{firstNameError}</Box>}

                    <Input
                        w="500px"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={handleLastNameBlur}
                    />
                    {lastNameError && <Box color="red">{lastNameError}</Box>}

                    <Input
                        w="500px"
                        placeholder="Nombre de usuario"
                        value={clientName}
                        onChange={(e) => debouncedCheckClientName(e.target.value)}
                        onBlur={handleClientNameBlur}
                    />
                    {clientNameError && <Box color="red">{clientNameError}</Box>}
                    

                    <Input
                        w="500px"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                    />
                    {emailError && <Box color="red">{emailError}</Box>}

                    <Input
                        w="500px"
                        placeholder="Inserte contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handlePasswordBlur}
                    />
                    {passwordError && <Box color="red">{passwordError}</Box>}

                    <Input
                        w="500px"
                        placeholder="Confirmar Contraseña"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={handleConfirmPasswordBlur}
                    />
                    {confirmPasswordError && <Box color="red">{confirmPasswordError}</Box>}

                    <Button w="500px" colorScheme="green" onClick={handleRegister}>Registrarse</Button>
                </Stack>
            </Box>
        </Flex>
    );
};

export default Register;