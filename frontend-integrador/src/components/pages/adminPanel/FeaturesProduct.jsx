import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  AlertDialogFooter,Button, Flex, Stack, HStack, VStack, Modal, ModalOverlay, ModalContent, ModalHeader,StackDivider, ModalFooter, ModalBody, ModalCloseButton, Input, Select, List, ListItem, Text, Box, UnorderedList, Container, Textarea} from '@chakra-ui/react';
import { FaEdit, FaTrash } from "react-icons/fa";


const FeaturesProduct = ({ isOpen, onClose,token, featuresEdit }) => {
  const [inputValue, setInputValue] = useState('');
  const [nombreRepetido, setNombreRepetido] = useState(false);
  const cancelRef = useRef(); // permite cancelar en el box de alerta
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
  const [featureToDelete, setfeatureToDelete] = useState(null); // pasa la variable del item a eliminar
  const [newFeature, setNewFeature] = useState({id:"", name:"", icon:"", value:""})


  const [featuresData, setFeaturesData] = useState([
    {id:1, name:"COLORES DISPONIBLES", value: "Negro con estampa verde.", icon: "🧩"},
    {id:2, name:"CALCE/AJUSTE", value: "Holgado - Suelto.", icon: "🧶"},
    {id:3, name:"MATERIALES/COMPOSICIÓN", value: "100% Algodón.", icon: "🟢"},
    {id:4, name:"TEMPORADA", value: "Invierno.", icon: "✳"},
    {id:5, name:"INSTRUCCIONES DE CUIDADO", value: "Lavar en 30 grados, no planchar la estampa, secar a la sombra.", icon: "💚"}]) 


    const openDeleteDialog = (feature) => {
      setIsDeleteDialogOpen(true);
      setfeatureToDelete(feature);
      /*Logica para eliminar la caracteristica de la base de datos usando .id */
    };
  
    const closeDeleteDialog = () => {
      setIsDeleteDialogOpen(false);
    };
  
    /*const handleDelete = async (id) => {
      try {
        // Realiza una solicitud DELETE a la API para eliminar la caracteristica.
        await axios.delete(`${baseUrl}/api/v1/admin/char/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Vuelve a obtener la lista de caracteristicas después de eliminar.
        getFeatures();
      } catch (error) {
        console.error("Error al eliminar la caracteristica", error);
      }
    };*/
  
    /*Deberia Agregar la nueva caracteristica con el Botton agregar y resetear el form*/
  const handleSetFeature = () =>{
    addFeature(newFeature);
    setInputValue(""); // Reinicia el valor del input

  }

  /*Deberia definir la funcion addFeature que cambia el valor de featuresData */
  const addFeature = (key, value) =>{
    setFeaturesData(prev)
  }

  /*Deberia traer el value de cada imput para setiar una nueva caracteristica SetNewFeature y luego agregarla a la featuresData*/
  const handleInputChange = (e) => {
    setNewFeature(e.tarjet.value);
  };
  


  const handleCancel = () => {
    // Cierra el modal y resetea el formulario
    onClose();
    //setProductData(initialProductState);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent mt={200}>
        <ModalHeader>ADMINISTRAR CARACTERISTICAS</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Formulario para Editar producto */}
          <Flex
              flexDirection="column"
              p={1}
              gap={5}
              my={1}
              maxHeight="45vh"
              overflowY="scroll"
            >
            <VStack
              divider={<StackDivider borderColor='gray.300' />}
              spacing={2}
              align='stretch'
              
            >
              {featuresData.map((feature) => (               
                <HStack
                  key={feature.id}
                  spacing={10}
                  justify={"space-between"}
                >
                  <Text as="span" noOfLines={[1, 2]}>{feature.name}: <br/>{feature.icon}  {feature.value} </Text>
                
                  <HStack spacing={"15px"} mr={2}>
                  <FaEdit
                    style={{
                      cursor: "pointer",
                      color: "green",
                      fontSize: "1em",
                    }}
                    /*onClick={() => handleEdit(feature.id)}*/
                  />
                  <FaTrash
                    style={{
                      cursor: "pointer",
                      color: "red",
                      fontSize: "1em",
                    }}
                  /*ver que se pasa como parametro en el openDeleteDialog*/
                    onClick={() => openDeleteDialog(feature)}
                  />
                  </HStack>
                </HStack>
                
              ))}

              </VStack>

                <VStack border={"2px"} borderRadius={"10px"} spacing={5} p={"5"} bg='green.100' mt={"20px"} mr={2}>
                <Text fontSize={"1rem"} fontWeight={'bold'}>AGREGAR NUEVA CARACTERISTICA</Text>
                <Input
                  name="featureName"
                  placeholder="Nombre de la caracteristica"
                  value={featuresData.name}
                  onChange={handleInputChange}
                />
                <Input
                  name="featureIcon"
                  placeholder="Icono representativo"
                  value={featuresData.icon}
                  onChange={handleInputChange}
                />
                <Textarea
                  name="featureValue"
                  placeholder="Descripcion de la caracteristica"
                  value={featuresData.value}
                  onChange={handleInputChange}
                />
                <Button bg={"black"} color={"white"} alignSelf={"flex-end"} onClick={handleSetFeature}>Agregar</Button>
                </VStack>
          </Flex>
          <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmación
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Seguro que quiere eliminar la caracteristica?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancelar
              </Button>
              {/*ver que se pasa por parametro en el handleDelete*/}
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete(featureToDelete.id);
                  closeDeleteDialog();
                }}
                ml={3}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

        </ModalBody>
        <ModalFooter justifyContent={'center'}>
          <Button colorScheme="green" mr={3} /*onClick={handleEditProduct}*/>
            Guardar Cambios
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    
  );
};

export default FeaturesProduct;