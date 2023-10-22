import { useState, useEffect } from "react";
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
    HStack, Input, SimpleGrid, Image, Text, Button, Center
} from "@chakra-ui/react";

import EditProduct from "./EditProduct";



const ListAdminProduct = () => {

    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbjEiLCJpYXQiOjE2OTc5MzA3MzUsImV4cCI6MTY5ODUzNTUzNX0.7a0pr2R8c11sJ8j_TL1io8Ph3JaNl8WWQbf6LRIlRbE"
    const [lista, setLista] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

console.log(isModalOpen, productToEdit);


    const getProducts = async () => {
        try {
            const response = await axios.get(  //Petición GET a la api del listado de productos
                `${baseUrl}/api/v1/admin/products`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });
            if (response.data && response.data.content) {  // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
                setLista(response.data.content);
                console.log("Datos recibidos:", response.data.content);
            }
        } catch (error) { //Manejo de errores
            console.error(error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);



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

        setIsModalOpen(true);  // llama a la apertura del modal en EditProduct
        setProductToEdit(product); // pasa el objeto product a traves del prop 
        console.log("Producto para editar:", productToEdit);
        console.log("Modal", isModalOpen);

    };


    return (
        <> 
            <Box>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                            <Th>Imagen</Th>
                            <Th>Editar</Th>
                            <Th>Eliminar</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {lista && lista.map((item) => (
                            <Tr key={item.id}>
                                <Td>{item.productId}</Td>
                                <Td>{item.productName}</Td>
                                <Td>
                                    <Img src={item.thumbnail} alt={item.productName} w={100} h={100} />
                                </Td>
                                <Td>
                                    <Button colorScheme="blue" onClick={() => handleEdit(item)}>Editar</Button>
                                </Td>
                                <Td>
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {/* Render condicional, solo se llama a EditProduct si la variable productToEdit es valida */}
            {productToEdit !== null && (<EditProduct productToEdit={productToEdit} isOpen={isModalOpen} onClose={() => {setProductToEdit(null); setIsModalOpen(false);}} getProducts={getProducts}/>)}
            {console.log("ProductToEditReturn:", productToEdit)}
        </>
    );
};

export default ListAdminProduct;