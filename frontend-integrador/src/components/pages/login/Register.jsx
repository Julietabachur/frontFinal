import React, { useState, useEffect} from 'react';
import { Box, Input, Button, Stack, Flex, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const nameRegex = /^[a-zA-Z][a-zA-Z_-]{2,22}$/; 
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;
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

   useEffect(() => {
        if (token) {
        getUsername(token);
        }
    }, []);

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
                console.log(response.data);
                localStorage.setItem('riskkojwt', JSON.stringify(response.data.token))
                window.alert('Registro exitoso. Serás redirigido a la página de inicio.');
                setTimeout(() => {
                    navigate("/");
                    window.location.reload()
                }, 1000);
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
                {media ? 
            (
                <Box pos={'relative'} top={10} bottom={100} mb={'250px'} w={'97vw'} h={'100vh'}>
                <Text fontSize='2xl' align='center' py={3}>Crear cuenta</Text>
                <Stack spacing={4} align="center" justify="center">
                    <Input 
                        w="250px" 
                        placeholder="Nombre" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                    />
                    {errors.firstName && <Box color="red" w="250px" align='center'>{errors.firstName}</Box>}
                    
                    <Input 
                        w="250px" 
                        placeholder="Apellido" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                    />
                    {errors.lastName && <Box color="red" w="250px" align='center'>{errors.lastName}</Box>}

                    <Input 
                        w="250px" 
                        placeholder="Nombre de usuario" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)}
                    />
                    {/* Validaciones y mensajes de error para otros campos */}

                    <Input 
                        w="250px" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                    />
                    {errors.email && <Box color="red" w="250px" align='center'>{errors.email}</Box>}

                    <Input 
                        w="250px" 
                        placeholder="Inserte contraseña" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                    />
                    {errors.password && <Box color="red" w="250px" align='center'>{errors.password}</Box>}

                    <Input 
                        w="250px" 
                        placeholder="Confirmar Contraseña" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                    />
                    {errors.confirmPassword && <Box color="red" w="250px" align='center'>{errors.confirmPassword}</Box>}

                    <Button w="200px" bg={"verde2"} onClick={handleRegister}>Crear cuenta</Button>
                </Stack>
            </Box>
            )
            :
            ( 
            <Box pos={'relative'} top={5} bottom={100}  mb={'200px'} w={'97vw'} h={'100vh'}>
                <Text fontSize='4xl' align='center' py={3}>Crear cuenta</Text>
                <Stack spacing={4} align="center" justify="center">
                    <Input 
                        w="500px" 
                        placeholder="Nombre" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                    />
                    {errors.firstName && <Box color="red" w={'500px'}>{errors.firstName}</Box>}
                    
                    <Input 
                        w="500px" 
                        placeholder="Apellido" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                    />
                    {errors.lastName && <Box color="red" w={'500px'}>{errors.lastName}</Box>}

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
                    {errors.email && <Box color="red" w={'500px'}>{errors.email}</Box>}

                    <Input 
                        w="500px" 
                        placeholder="Inserte contraseña" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                    />
                    {errors.password && <Box color="red" w={'500px'}>{errors.password}</Box>}

                    <Input 
                        w="500px" 
                        placeholder="Confirmar Contraseña" 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                    />
                    {errors.confirmPassword && <Box color="red" w={'500px'}>{errors.confirmPassword}</Box>}

                    <Button w="500px" bg={"verde2"} onClick={handleRegister}>Crear cuenta</Button>
                </Stack>
            </Box>
            )}
        </Flex>
       
    );
};

export default Register;
