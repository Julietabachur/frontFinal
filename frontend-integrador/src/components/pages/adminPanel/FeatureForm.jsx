import { Alert, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';


const FeatureForm = ({token, getFeatures}) => {

  const adminUrl = import.meta.env.VITE_ADMIN_URL;

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newFeature, setNewFeature] = useState({charName: '', charIcon: ''})

  // controla el envio del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
      addFeature(newFeature);
      setNewFeature({charName: "", charIcon:""});
      getFeatures() 
    }
    

  // LOGICA para agregar una nueva caracteristica

  //llamada a la api, peticion POST para agregar caracteristica
  const addFeature = (newFeature) => {
    axios.post(`${adminUrl}/char`, newFeature, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        window.alert("Característica agregada con exito");
        console.log("Característica agregada con éxito:", response.data)
        setTimeout(() =>{
          onClose();   
        }, 1000)
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Si el error es 400, muestra una alerta con el mensaje de error del servidor
          window.alert(error.response.data.error);
          } else {
          // Para otros errores, muestra un mensaje de error genérico
          console.error("Error al agregar la caracteristica:", error);
          }
      });
  };
  
  return (
    <>

    <Button border="2px" colorScheme="green" onClick={onOpen}>
    Nueva Característica
    </Button>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt={150}>
          <ModalHeader>Nueva Característica</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <form>
            <FormControl>
              <FormLabel> Nombre de la característica</FormLabel>
              <Input
                type="text"
                name="newCharName"
                placeholder="Nombre"
                mb={3}
                value={newFeature.charName}
                onChange={(e) => setNewFeature({...newFeature, charName: (e.target.value).toUpperCase()})}
              />
              <FormLabel> Ícono representativo </FormLabel>
              <Input
                type="text"
                name="newCharIcon"
                mb={3}
                value={newFeature.charIcon}
                onChange={(e) => setNewFeature({...newFeature, charIcon: e.target.value})}
              />
              <Button type= "reset" mr={3} onClick={onClose}> Cancelar</Button>
              <Button colorScheme='green' onClick={handleSubmit} >Guardar</Button>
            </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      </>
  )
}

export default FeatureForm