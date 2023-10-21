import React, { useState } from 'react';
import { Box, Input, Button, Stack, Flex } from '@chakra-ui/react';

// Expresiones regulares
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('usuario');
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
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Rol:', role);
  };

  const handleRegister = () => {
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

    // Lógica de registro
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Rol:', role);
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      p={4}
    >
      <Box maxW="md" borderWidth="1px" borderRadius="lg" p={8}>
        <Stack spacing={4}>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailError && <Box color="red">{emailError}</Box>}
          <Input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {passwordError && <Box color="red">{passwordError}</Box>}
          <Stack direction="row" spacing={4}>
            <Button colorScheme="teal" onClick={handleLogin}>Iniciar Sesión</Button>
            <Button colorScheme="teal" onClick={handleRegister}>Registrarse</Button>
          </Stack>
          <Button colorScheme="teal" onClick={() => setRole('usuario')}>Rol: Usuario</Button>
          <Button colorScheme="teal" onClick={() => setRole('administrador')}>Rol: Administrador</Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default LoginPage;