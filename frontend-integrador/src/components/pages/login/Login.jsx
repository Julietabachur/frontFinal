import React, { useState } from 'react';
import { Box, Input, Button, Stack, Flex } from '@chakra-ui/react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = () => {
        // Validar email y contraseña antes de continuar
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

        // Lógica de autenticación 
        
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
            {emailError && <Box color="red">{emailError}</Box>}
            <Input w="500px" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {passwordError && <Box color="red">{passwordError}</Box>}
            <Button colorScheme="green" onClick={handleLogin}>Iniciar Sesión</Button>
        </Stack>

        </Box>
        </Flex>
    );
};

export default Login;
