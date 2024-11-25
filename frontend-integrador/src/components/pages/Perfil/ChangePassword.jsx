import React, { useState } from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from 'axios';

const ChangePassword = ({isOpen, 
  onClose, 
  token, 
  baseUrl, 
  clientId }) => {
    const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // First, validate current password
      await validateCurrentPassword(formData.currentPassword);
      
      // If current password is valid, change to new password
      await changePassword(formData.newPassword);
      
      toast({
        title: "Contraseña actualizada",
        status: "success",
        duration: 3000,
        position: "top-right"
      });
      
      onClose();
      reset();
    } catch (error) {
      toast({
        title: error.message || "Error al cambiar contraseña",
        status: "error",
        duration: 3000,
        position: "top-right"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateCurrentPassword = async (currentPassword) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/private/validate-password`, 
        { password: currentPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Contraseña actual incorrecta");
    }
  };

  const changePassword = async (newPassword) => {
    try {
      await axios.put(`${baseUrl}/api/v1/private/clients/${clientId}/change-password`, 
        { newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      throw new Error("No se pudo cambiar la contraseña");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cambiar Contraseña</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={errors.currentPassword} mb={3}>
              <FormLabel>Contraseña Actual</FormLabel>
              <Input
                type="password"
                {...register("currentPassword", {
                  required: "Contraseña actual es requerida"
                })}
              />
              <FormErrorMessage>
                {errors.currentPassword?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.newPassword} mb={3}>
              <FormLabel>Nueva Contraseña</FormLabel>
              <Input
                type="password"
                {...register("newPassword", {
                  required: "Nueva contraseña es requerida",
                  pattern: {
                    value: passwordRegex,
                    message: "La contraseña debe tener al menos 8 caracteres, incluir letras, números y un carácter especial"
                  }
                })}
              />
              <FormErrorMessage>
                {errors.newPassword?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword} mb={3}>
              <FormLabel>Confirmar Nueva Contraseña</FormLabel>
              <Input
                type="password"
                {...register("confirmPassword", {
                  required: "Confirmación de contraseña es requerida",
                  validate: (value) => 
                    value === watch("newPassword") || "Las contraseñas no coinciden"
                })}
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="gray" 
              mr={3} 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              backgroundColor="#e1bc6a"
              color="white"
              _hover={{ backgroundColor: "#d3a45a" }}
              isLoading={isLoading}
            >
              Cambiar Contraseña
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ChangePassword