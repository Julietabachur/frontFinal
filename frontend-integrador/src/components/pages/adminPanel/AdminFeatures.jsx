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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Alert,
} from '@chakra-ui/react'
import { FaTrash, FaEdit } from "react-icons/fa";
import FeatureForm from './FeatureForm';
import EditFeature from './EditFeature';


const AdminFeatures = ({ getFeatures, featurePage, handlePageChange, featuresList, token }) => {

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const cancelRef = useRef(); // permite cancelar en el box de alerta
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
  const [featureToDelete, setFeatureToDelete] = useState(null); // pasa la variable del item a eliminar
  const [featureToEdit, setFeatureToEdit] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure();


  // LOGICA para editar una caracteristica.
  const handleEdit = (char) => {
    onOpen();
    setFeatureToEdit(char);
  };

  const handleCancel = () => {
    onClose();
    setFeatureToEdit(null);
  }

  const handleChange = () => {
    onClose();
    setFeatureToEdit(null);
    getFeatures();
  }

  useEffect(() => {
    getFeatures();
  }, [featurePage]);

  //LOGICA para eliminar una caracteristica
  const openDeleteDialog = (feature) => {
    setIsDeleteDialogOpen(true);
    setFeatureToDelete(feature);
    console.log(featureToDelete)
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
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
      // Deberia volver a la pagina 1. Ver como ?
      getFeatures();
    } catch (error) {
      console.error("Error al eliminar la caracteristica", error);
    }
  };

  // renderizado del componente
  return (
    <>
      <Flex justify={"center"}>
        <Box mt={10} >
          <Box display={"flex"} justifyContent={"space-between"}>
            {/* Componente del modal para agregar caracteristica */}
            <FeatureForm
              token={token}
              getFeatures={getFeatures}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button colorScheme="green"
                onClick={() => handlePageChange(featurePage > 1 ? featurePage - 1 : featurePage)
                }
                disabled={featurePage === 0}
              >
                &lt;&lt;&lt;
              </Button >
              <Text>- {featurePage} -</Text>
              <Button colorScheme="green" onClick={() => handlePageChange(featurePage + 1)}
              > &gt;&gt;&gt;
              </Button>
            </div>
          </Box>
          <TableContainer w={830} mt={3} /*border="2px" boxShadow='lg' bg='white'
              flexDirection="column"
              p={1}
              gap={5}
              overflowY="scroll"
              maxHeight="50vh"*/
          >
            <Table variant="striped" colorScheme="green">
              <Thead /*borderBottom="2px"*/ >
                <Tr>
                  <Th>
                    <Text fontWeight="bold">Nombre</Text>
                  </Th>
                  <Th>
                    <Text fontWeight="bold">Icono</Text>
                  </Th>
                  <Th>
                    <Text fontWeight="bold">Editar / Eliminar</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody fontSize="0.9em">
                {featuresList &&
                  featuresList.map((feature) => (
                    <Tr key={feature.id} h="10px">
                      <Td>{feature.charName}</Td>
                      <Td>{feature.charIcon}</Td>
                      <Td>
                        <FaEdit
                          style={{
                            cursor: "pointer",
                            color: "green",
                            fontSize: "1.2em",
                            marginBottom: "10px",
                            marginLeft: "40px"
                          }}
                          onClick={() => handleEdit(feature)}
                        />


                        <FaTrash
                          style={{
                            cursor: "pointer",
                            color: "red",
                            fontSize: "1.2em",
                            marginbottom: "10px",
                            marginLeft: "40px"
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
                    setTimeout(() => {
                      closeDeleteDialog();
                    }, 1000);
                  }}
                  ml={3}
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent mt={150}>
              <ModalHeader>Editar Caracteristica</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {featureToEdit !== null && (
                  <EditFeature
                    featureToEdit={featureToEdit}
                    handleCancel={handleCancel}
                    handleChange={handleChange}
                    token={token}
                  />
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
    </>
  );
};

export default AdminFeatures