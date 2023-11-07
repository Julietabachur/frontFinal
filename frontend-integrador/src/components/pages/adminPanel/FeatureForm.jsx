import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';

const initialFeatureState = {
    charName: "",
    charIcon: "",
    };

const FeatureForm = ({token, getFeatures}) => {

  const [ newFeature, setNewFeature] = useState(initialFeatureState)
  const [showSuccess, setShowSuccess] = useState(false); // variable para controlar el aviso de exito. NO IMPLEMENTADO
  const [showError, setShowError] = useState(false); // Variable para controlar el mensaje de error. NO IMPLEMENTADO
  const { isOpen, onOpen, onClose } = useDisclosure()


  // LOGICA para agregar una nueva caracteristica
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewFeature({ ...newFeature, [name]: value });
      console.log(newFeature)
    };
  
    const handleNewFeature = () => {
      console.log("Datos Formulario:", newFeature);
      addFeature(newFeature);
       // Cierra el modal y resetea el formulario
       onClose();
       setNewFeature({});   
    };

  //llamada a la api, peticion POST para agregar caracteristica
  const addFeature = (newFeature) => {
    axios.post("http://localhost:8080/api/v1/admin/char", newFeature, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Caracteristica agregada con éxito:", response.data);
        // Oculta el mensaje de éxito después de 1.5 segundos (1500 milisegundos)
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
        getFeatures();
      })
      .catch((error) => {
        // Maneja el error de la solicitud POST aquí - VERIFICAR.
        alert("Error al agregar la caracteristica, la misma ya existe en la base de datos. Verifiquelo o elija otro nombre");
        console.error("Error al agregar la caracteristica:", error);
        // Muestra un mensaje de error al usuario
      });
  };
  
  return (
    <>

    <Button border="2px" colorScheme="green" onClick={onOpen}>
    Nueva Caracteristica
    </Button>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva Caracteristica</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              /*FALTAN LAS VALIDADCIONES PARA LOS IMPUT 
            <FormControl isRequired>
              <FormLabel> Nombre de la caracteristica</FormLabel>
              <Input
                name="charName"
                mb={3}
                value={newFeature.charName}
                onChange={handleInputChange}
              />
              <FormLabel> Icono representativo </FormLabel>
              <Input
                name="charIcon"
                mb={3}
                value={newFeature.charIcon}
                onChange={handleInputChange}
              />
          </FormControl>
          </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant='ghost' onClick={handleNewFeature} >Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default FeatureForm