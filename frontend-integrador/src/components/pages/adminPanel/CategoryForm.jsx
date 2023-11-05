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

    const initialCategoryState = {
    categoryName: "",
    description: "",
    imageUrl: "",
    };

    const CategoryForm = ({ isModalCategoriaOpen,setIsModalCategoriaOpen, onClose, getCategories, token }) => {
    const [categoryData, setCategoryData] = useState(initialCategoryState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
    };

    const handleAddCategory = () => {
        // Enviar la solicitud para agregar la categoría
        axios
        .post("http://localhost:8080/api/v1/admin/category", categoryData, {headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
            console.log("Categoría agregada con éxito:", response.data);
            // Actualizar la lista de categorías después de agregar una nueva
            getCategories();
            // Cerrar el modal y resetear el formulario
            onClose();
            setCategoryData(initialCategoryState);
        })
        .catch((error) => {
            console.error("Error al agregar la categoría:", error);
            // Puedes manejar errores aquí si es necesario
        });
    };

    const handleCancel = () => {
        // Cerrar el modal y resetear el formulario
        onClose();
        setCategoryData(initialCategoryState);
    };

    return (
        <Modal isOpen={isModalCategoriaOpen} onClose={handleCancel}>
            <ModalOverlay />
            <ModalContent mt={200}>
                <ModalHeader>Agregar Categoría</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                {/* Formulario para agregar categoría */}
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
                <Button colorScheme="green" mr={3} onClick={handleAddCategory}>
                    Agregar
                </Button>
                <Button onClick={handleCancel}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        );
        };
    
    export default CategoryForm;