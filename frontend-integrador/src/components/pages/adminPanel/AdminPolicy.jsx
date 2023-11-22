import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { useRef, useState } from 'react';
import EditPolicy from './EditPolicy';
import PolicyForm from './PolicyForm';

const AdminPolicy = ({token, getPolicyAll, policyListAll}) => {

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const cancelRef = useRef(); // permite cancelar en el box de alerta
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
    const [policyToDelete, setPolciyToDelete] = useState(null); // pasa la variable del item a eliminar
    const [policyToEdit, setPolicyToEdit] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure();

    //LOGICA para editar una politica.
    const handleEdit = (policy) => {
        onOpen();
        setPolicyToEdit(policy);
    };

    const handleCancel = () => {
        onClose();
        setPolicyToEdit(null);
    };

    const handleChange = () => {
        onClose();
        setPolicyToEdit(null);
        getPolicyAll();
    };

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
        getPolicyAll();
    } catch (error) {
        console.error("Error al eliminar la politica", error);
    }
    };

    // renderizado del componente
    return (
    <>
    <Flex justify={"center"}>
        <Box mt={10} >
            {/* Componente del modal para agregar politica */}
            <PolicyForm
            token={token}
            getPolicyAll={getPolicyAll}
            />

            <TableContainer 
            w={830} mt={3}
            flexDirection="column"
            p={1}
            gap={5}
            overflowY="scroll"
            maxHeight="50vh"
            >
            <Table variant="striped" colorScheme="green">
                <Thead borderBottom="2px">
                    <Tr>
                        <Th>
                            <Text fontWeight="bold">Nombre</Text>
                        </Th>
                        <Th>
                            <Text fontWeight="bold">Descripcion</Text>
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
                        <Td>{policy.description}</Td>
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
                        ¿Seguro que quiere eliminar esta politica?
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
                    <ModalHeader>Editar Politica</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                    {policyToEdit !== null && (
                    <EditPolicy
                    policyToEdit={policyToEdit}
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

}

export default AdminPolicy