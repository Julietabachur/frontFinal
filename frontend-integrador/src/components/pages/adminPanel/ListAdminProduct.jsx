import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Img,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    HStack,
    Input,
    SimpleGrid,
    Image,
    Text,
    Button,
    Center,
    } from "@chakra-ui/react";
import EditProduct from "./EditProduct";
import { FaEdit, FaTrash } from 'react-icons/fa';

    const ListAdminProduct = ({ getProducts, page, handlePageChange, lista }) => {
    console.log("COMIENZA LISTADMIN");
    console.log(page);
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJjbGllbnROYW1lIjoiYWRtaW4xIiwic3ViIjoiYWRtaW4xQGFkbWluMS5jb20iLCJpYXQiOjE2OTg1OTY2MjYsImV4cCI6MTY5OTIwMTQyNn0.lEN5fevoixjN4WXzCC3iSn9P4XTkoMfoDmpALGvbEPE";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // constantes del Alert Box

    const cancelRef = useRef(); // permite cancelar en el box de alerta
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
    const [itemToDelete, setItemToDelete] = useState(null); // pasa la variable del item a eliminar

    console.log(isModalOpen, productToEdit);

    useEffect(() => {
        getProducts();
    }, [page]); // Agrega 'page' como dependencia para que se actualice cuando cambie el número de página

    const openDeleteDialog = (item) => {
        setIsDeleteDialogOpen(true);
        setItemToDelete(item);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleDelete = async (id) => {
        try {
        // Realiza una solicitud DELETE a la API para eliminar el producto
        await axios.delete(`${baseUrl}/api/v1/admin/products/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        // Vuelve a obtener la lista de productos después de eliminar.
        getProducts();

        console.log(lista);
        } catch (error) {
        console.error("Error al eliminar el producto", error);
        }
    };

    const handleEdit = (product) => {
        setIsModalOpen(true); // llama a la apertura del modal en EditProduct
        setProductToEdit(product); // pasa el objeto product a traves del prop
        console.log("Producto para editar:", productToEdit);
        console.log("Modal", isModalOpen);
    };

    return (
        <>
        <Box>
            <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
            }}
            >
            <Button
                onClick={() => handlePageChange(page > 1 ? page - 1 : page)}
                disabled={page === 0}
            >
                &lt;&lt;&lt;
            </Button>
            <Text>- {page} -</Text>
            <Button onClick={() => handlePageChange(page + 1)}>
                &gt;&gt;&gt;
            </Button>
            </div>
            <Table variant="simple">
            <Thead>
            <Tr>
                <Th>
                    <Text fontWeight="bold">ID</Text>
                </Th>
                <Th>
                    <Text fontWeight="bold">Nombre</Text>
                </Th>
                <Th>
                    <Text fontWeight="bold">Imagen</Text>
                </Th>
                <Th>
                    <Text fontWeight="bold">Editar</Text>
                </Th>
                <Th>
                    <Text fontWeight="bold">Eliminar</Text>
                </Th>
            </Tr>

            </Thead>
            <Tbody>
                {lista &&
                lista.map((item) => (
                    <Tr key={item.id} h="10px">
                    {" "}
                    {/* Establece la altura deseada aquí */}
                    <Td>{item.productId}</Td>
                    <Td>{item.productName}</Td>
                    <Td>
                        <Img
                        src={item.thumbnail}
                        alt={item.productName}
                        w={50}
                        h={50}
                        />{" "}
                        {/*achique la imagen*/}
                    </Td>
                    <Td>
                        {/* Icono de editar */}
                        <FaEdit
                        style={{ cursor: 'pointer', color: 'green', fontSize: '1.2em' }}
                        onClick={() => handleEdit(item)}
                        />
                    </Td>
                    <Td>
                    {/* Icono de eliminar */}
                    <FaTrash
                    style={{ cursor: 'pointer', color: 'red', fontSize: '1.2em' }}
                    onClick={() => openDeleteDialog(item)}
                    />
                    </Td>
                    </Tr>
                ))}
            </Tbody>
            </Table>
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
                ¿Seguro que quiere eliminar el item?
                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeDeleteDialog}>
                    Cancelar
                </Button>
                <Button
                    colorScheme="red"
                    onClick={() => {
                    handleDelete(itemToDelete.id);
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

        {/* Render condicional, solo se llama a EditProduct si la variable productToEdit es valida */}
        {productToEdit !== null && (
            <EditProduct
            productToEdit={productToEdit}
            isOpen={isModalOpen}
            onClose={() => {
                setProductToEdit(null);
                setIsModalOpen(false);
            }}
            getProducts={getProducts}
            />
        )}
        </>
    );
    };

export default ListAdminProduct;
