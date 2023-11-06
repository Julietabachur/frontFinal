import React from 'react'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Alert,
  AlertIcon
  } from '@chakra-ui/react'
import { FaEdit, FaTrash } from "react-icons/fa";


const AdminFeatures = ({getFeatures, listFeatures, token}) => {

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const cancelRef = useRef(); // permite cancelar en el box de alerta
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
  const [featureToDelete, setFeatureToDelete] = useState(null); // pasa la variable del item a eliminar
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ newFeature, setNewFeature] = useState( {charName:"", charIcon:""})
  const [showSuccess, setShowSuccess] = useState(false); // variable para controlar el aviso de exito. NO IMPLEMENTADO
  const [showError, setShowError] = useState(false); // Variable para controlar el mensaje de error. NO IMPLEMENTADO

  // VER LA LISTA DE CARACTERISTICA QUE NO SEA UN ARRAY DE 10. QUE TRAIGA TODAS. CAMBIAR BACK.

  useEffect(() => {
    getFeatures();
  }, []);

  const openDeleteDialog = (feature) => {
    setIsDeleteDialogOpen(true);
    setFeatureToDelete(feature);
    console.log(featureToDelete)
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeature({ ...newFeature, [name]: value });
    console.log(newFeature)
  };

  //LOGICA DE AGREGAR NUEVA CARACTERISTICA - Solo llamado a API y manejo de respuesta.
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

  const handleNewFeature = () => {
    console.log("Datos Formulario:", newFeature);
    addFeature(newFeature);
     // Cierra el modal y resetea el formulario
     onClose();
     setNewFeature({});   
  };

  const handleDelete = async (id) => {
    try {
      // Realiza una solicitud DELETE a la API para eliminar la caracteristica
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
  };

    return (
      <Flex justify={"center"}>
        <Box mt={10} >
            <Button border="2px" bg={"verde2"} onClick={onOpen}>
              Nueva Caracteristica
            </Button>
          <TableContainer w={830} mt={3} border="2px" boxShadow='lg' bg='white'
              flexDirection="column"
              p={1}
              gap={5}
              overflowY="scroll"
              maxHeight="50vh"
            >
            <Table variant="striped" colorScheme="green">
              <Thead borderBottom="2px" >
                <Tr >
                  <Th>
                    <Text fontWeight="bold">Nombre</Text>
                  </Th>
                  <Th>
                    <Text fontWeight="bold">Icono</Text>
                  </Th>
                  <Th>
                    <Text fontWeight="bold">Editar</Text>
                  </Th>
                  <Th>
                    <Text fontWeight="bold">Eliminar</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody fontSize="0.9em">
                {listFeatures &&
                  listFeatures.map((feature) => (
                    <Tr key={feature.id} h="10px">
                      <Td>{feature.charName}</Td>
                      <Td>{feature.charIcon}</Td>
                      <Td>
                        <FaEdit
                        style={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "1.2em",
                        }}
                        /*onClick={() => handleEdit(item)}*/
                        />
                      </Td>
                      <Td>
                        <FaTrash
                        style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "1.2em",
                        }}
                        onClick={() => openDeleteDialog(feature)}
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
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
              ¿Seguro que quiere eliminar esta caracteristica?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancelar
              </Button>
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
      
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva Caracteristica</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
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
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant='ghost' onClick={handleNewFeature} >Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

     </Flex>
    );
  }
export default AdminFeatures