import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';

const PolicyForm = ({token, getPolicy, getPolicyAll}) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newPolicy, setNewPolicy] = useState({policyName: '', description: ''})

  // controla el envio del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
      addPolicy(newPolicy);
      setNewPolicy({policyName: "", description:""});
    }
    

  // LOGICA para agregar una nueva politica

  //llamada a la api, peticion POST para agregar politica
  const addPolicy = (newPolicy) => {
    axios.post("http://localhost:8080/api/v1/admin/policy", newPolicy, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        window.alert("Politica agregada con exito");
        console.log("Politica agregada con éxito:", response.data)
        getPolicyAll();
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Si el error es 400, muestra una alerta con el mensaje de error del servidor
          window.alert(error.response.data.error);
          } else {
          // Para otros errores, muestra un mensaje de error genérico
          console.error("Error al agregar la politica:", error);
          }
      });
  };
  
  return (
    <>

    <Button border="2px" colorScheme="green" onClick={onOpen}>
    Nueva Politica
    </Button>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt={150}>
          <ModalHeader>Nueva Política</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <form>
            <FormControl>
              <FormLabel> Nombre de la política</FormLabel>
              <Input
                type="text"
                name="newPolicyName"
                placeholder="Nombre"
                mb={3}
                value={newPolicy.policyName}
                onChange={(e) => setNewPolicy({...newPolicy, policyName: (e.target.value).toUpperCase()})}
              />
              <FormLabel> Descripción </FormLabel>
              <Input
                type="text"
                name="newDescription"
                mb={3}
                value={newPolicy.description}
                onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
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

export default PolicyForm;