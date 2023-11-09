import { Alert, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';


const FeatureForm = ({token, getFeatures}) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newFeature, setNewFeature] = useState({charName: '', charIcon: ''})
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false) 

  const handleSubmit = (e) => {
    e.preventDefault();
    addFeature(newFeature);
    setNewFeature({charName: "", charIcon:""});
    setTimeout(() =>{
      onClose();
      setShow(false);
      setError(false)
    }, 2000)
    getFeatures()
    }
    

  // LOGICA para agregar una nueva caracteristica

  //llamada a la api, peticion POST para agregar caracteristica
  const addFeature = (newFeature) => {
    axios.post("http://localhost:8080/api/v1/admin/char", newFeature, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Caracteristica agregada con éxito:", response.data);
        // Oculta el mensaje de éxito después de 1.5 segundos (1500 milisegundos)
        setShow(true);
        setError(false);  
      })
      .catch((error) => {
        setShow(false);
        setError(true);
        // Maneja el error de la solicitud POST aquí - VERIFICAR.
        console.error("Error al agregar la caracteristica:", error);
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
          <ModalCloseButton/>
          <ModalBody>
            <form>
            <FormControl>
              <FormLabel> Nombre de la caracteristica</FormLabel>
              <Input
                type="text"
                name="newCharName"
                placeholder="Nombre"
                mb={3}
                value={newFeature.charName}
                onChange={(e) => setNewFeature({...newFeature, charName: (e.target.value).toUpperCase()})}
              />
              <FormLabel> Icono representativo </FormLabel>
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
            {show && <Alert style={{color: 'green'}}>Caracteristica agregada con exito</Alert>}
            {error && <Alert style={{color: 'red'}}> Error al agregar la caracteristica, el nombre ya existe. Verifiquelo o elija otro nombre</Alert>}
          </ModalBody>
        </ModalContent>
      </Modal>
      </>
  )
}

export default FeatureForm