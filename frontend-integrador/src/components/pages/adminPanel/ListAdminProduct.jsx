import React, { useState, useEffect } from "react";
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
    Button,
    
} from "@chakra-ui/react";

import EditProduct from "./EditProduct";
import AddProduct from "./AddProduct"; // Asegúrate de importar el componente AddProduct

const ListAdminProduct = () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbjEiLCJpYXQiOjE2OTc5MTE1MDgsImV4cCI6MTY5ODUxNjMwOH0.Ui4Z3777Fcka5v172FHNurtZ7zNRcolHXPib81cgnWI";
    const [lista, setLista] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const getProducts = async (updateProductList) => {
        try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/products`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });
        if (response.data && response.data.content) {
            setLista(response.data.content);
            console.log("Datos recibidos:", response.data.content);
        }
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
        await axios.delete(`${baseUrl}/api/v1/admin/products/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        getProducts();
        } catch (error) {
        console.error("Error al eliminar el producto", error);
        }
    };

    const handleEdit = (product) => {
        setIsModalOpen(true);
        setProductToEdit(product);
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
            
        </>
    );
};

export default ListAdminProduct;
