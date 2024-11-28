import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, FormControl, InputGroup, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;

const ResetPassword = () => {
  const [media, setMedia] = useState(window.innerWidth < 768); // Define a default value for media
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, register, formState: { errors }, watch } = useForm();

  useEffect(() => {
    const handleResize = () => {
      setMedia(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (formData) => {
    const data = {
      newPassword: formData?.password,
      repeatNewPassword: formData?.repeatPassword,
    };

    alert('Aca va la la pegada al endpoint para actiualizar la contraseña')

    try {
      const response = await axios.put(RESETPASSWORD_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        localStorage.setItem("riskkojwt", JSON.stringify(response.data.token));
        alert("Listo! Ya cambiaste tu contraseña!");
        //navegamos a la home o al login?
      }
    } catch (error) {
      console.error("Error al resetear el password:", error);
    }
  };

  const password = watch("password");

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
      <Box>
        <Text fontSize={media ? "2xl" : "4xl"} align="center" py={3}>
          Elije una nueva contraseña 
        </Text>
         
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormControl isInvalid={errors.password} mb={4}>
            <InputGroup>
              <Input
                placeholder="Contraseña"
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                borderColor={errors.password ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a"
                {...register("password", {
                  required: "Contraseña es requerida",
                  pattern: {
                    value: passwordRegex,
                    message: "La contraseña no cumple con los requisitos",
                  },
                })}
              />
            </InputGroup>
          </FormControl>

          <FormControl isInvalid={errors.repeatPassword} mb={4}>
            <InputGroup>
              <Input
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                borderColor={errors.repeatPassword ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a"
                {...register("repeatPassword", {
                  required: "Repite la contraseña es requerida",
                  validate: value =>
                    value === password || "Las contraseñas no coinciden",
                })}
              />
            </InputGroup>
          </FormControl>

          <button type="submit" onClick={()=> onSubmit()}>Cambiar Contraseña</button>
        </form>
      </Box>
    </Flex>
  );
};

export default ResetPassword;