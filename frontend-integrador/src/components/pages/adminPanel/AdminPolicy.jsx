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
} from '@chakra-ui/react'
import EditPolicy from './EditPolicy';
import PolicyForm from './PolicyForm';
import { FaTrash, FaEdit } from "react-icons/fa";

const AdminPolicy = ({token, getPolicy, policyPage, policyList, getPolicyAll, policyListAll, handlePageChange}) => {


    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const cancelRef = useRef(); // permite cancelar en el box de alerta
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
    const [policyToDelete, setPolciyToDelete] = useState(null); // pasa la variable del item a eliminar
    const [policyToEdit, setPolicyToEdit] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure();


    //LOGICA para editar una politica.
    const handleEdit = (policy) => {
        onOpen();
        getPolicy();
        getPolicyAll();
        setPolicyToEdit(policy);
    };

    const handleCancel = () => {
        onClose();
        setPolicyToEdit(null);
    };

    const handleChange = () => {
        onClose();
        setPolicyToEdit(null);
    };

    useEffect(() => {
        getPolicy();
    }, [policyPage]);

    useEffect(() => {
        getPolicyAll();
    }, []);




    //LOGICA para eliminar una caracteristica
    const openDeleteDialog = (policy) => {
        setIsDeleteDialogOpen(true);
        setPolciyToDelete(policy);
        console.log(policyToDelete)
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleDelete = async (id) => {
        try {
        // Realiza una solicitud DELETE a la API para eliminar la politica
        await axios.delete(`${baseUrl}/api/v1/admin/policy/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Vuelve a obtener la lista de politicas después de eliminar.
        // Deberia volver a la pagina 1. Ver como ?
        getPolicyAll()
        getPolicy();
    } catch (error) {
        console.error("Error al eliminar la política", error);
    }
    };

    // renderizado del componente
    return (
    <>
    <Flex justify={"center"}>
        <Box mt={10} >
            <Box display={"flex"} justifyContent={"space-between"}>
                {/* Componente del modal para agregar politica */}
                <PolicyForm
                token={token}
                getPolicy={getPolicy}
                getPolicyAll={getPolicyAll}
                />
                <div
                style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                }}
                >
                <Button
                colorScheme="green"
                onClick={() => handlePageChange(policyPage > 1 ? policyPage - 1 : policyPage)
                }
                disabled={policyPage === 0}
                >
                &lt;&lt;&lt;
                </Button >
                    <Text>- {policyPage} -</Text>
                <Button colorScheme="green" onClick={() => handlePageChange(policyPage + 1)}
                >
                    &gt;&gt;&gt;
                </Button>
                </div>
            </Box>

            <TableContainer w={830} mt={3}>
            <Table variant="striped" colorScheme="green">
                <Thead borderBottom="2px">
                    <Tr>
                        <Th>
                            <Text fontWeight="bold">Nombre</Text>
                        </Th>
                        <Th>
                            <Text fontWeight="bold">Descripción</Text>
                        </Th>
                        <Th>
                            <Text fontWeight="bold">Editar / Eliminar</Text>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody fontSize="0.9em">
                    {policyListAll &&
                    policyListAll.map((policy) => (
                    <Tr key={policy.id} h="10px">
                        <Td>{policy.policyName}</Td>
                        <Td > <Text maxWidth={"400px"} noOfLines={1}>{policy.description}</Text> </Td>
                        <Td>
                            <FaEdit
                            style={{
                            cursor: "pointer",
                            color: "green",
                            fontSize: "1.2em",
                            marginBottom: "10px",
                            marginLeft: "40px"
                            }}
                            onClick={() => handleEdit(policy)}
                            />
                            <FaTrash
                            style={{
                            cursor: "pointer",
                            color: "red",
                            fontSize: "1.2em",
                            marginbottom: "10px",
                            marginLeft: "40px"
                            }}
                            onClick={() => openDeleteDialog(policy)}
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
                        ¿Seguro que quiere eliminar esta política?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={closeDeleteDialog}>
                            Cancelar
                        </Button>
                        <Button
                        colorScheme="red"
                        ml={3}
                        onClick={() => {
                        handleDelete(policyToDelete.id);
                        setTimeout(() => {
                            closeDeleteDialog();
                        }, 1000);
                        }}
                        >
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

        <Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent mt={150}>
                    <ModalHeader>Editar Política</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                    {policyToEdit !== null && (
                    <EditPolicy
                    policyToEdit={policyToEdit}
                    handleCancel={handleCancel}
                    handleChange={handleChange}
                    getPolicyAll={getPolicyAll}
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

}

export default AdminPolicy;