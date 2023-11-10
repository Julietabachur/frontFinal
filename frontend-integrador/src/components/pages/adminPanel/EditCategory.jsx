import React, { useState } from "react";
import {
    Input,
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    } from "@chakra-ui/react";
    import axios from "axios";
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    const EditCategory = ({ isOpen, onClose, categoryToEdit, getCategories, token }) => {
    const [categoryData, setCategoryData] = useState({
        categoryName: categoryToEdit.categoryName,
        description: categoryToEdit.description,
        imageUrl: categoryToEdit.imageUrl,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
    };

    const handleEditCategory = async () => {
        try {
        await axios.put(
            `${baseUrl}/api/v1/admin/category/${categoryToEdit.id}`,
            categoryData,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        console.log("Categoría actualizada con éxito");
        getCategories(); // Actualizar la lista de categorías después de editar
        onClose(); // Cerrar el modal
        } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt={200}>
            <ModalHeader>Editar Categoría</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            {/* Formulario para editar categoría */}
            <Input
                name="categoryName"
                mb={3}
                placeholder="Nombre de la Categoría"
                value={categoryData.categoryName}
                onChange={handleInputChange}
            />
            <Input
                name="description"
                mb={3}
                placeholder="Descripción"
                value={categoryData.description}
                onChange={handleInputChange}
            />
            <Input
                name="imageUrl"
                mb={3}
                placeholder="Enlace de la Imagen"
                value={categoryData.imageUrl}
                onChange={handleInputChange}
            />
            </ModalBody>
            <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleEditCategory}>
                Guardar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
    };

export default EditCategory;
