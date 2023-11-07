import { Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'

const EditFeature = (token, featureToEdit, isOpen, onClose, getFeatures) => {

  return (
    <>
     
    
      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nueva Caracteristica</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>hOLA</Text>
              {/*<FormControl>
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
    </FormControl>*/}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cerrar
              </Button>
              <Button variant='ghost' /*onClick={handleNewFeature}*/ >Guardar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </>
    )
  }

export default EditFeature