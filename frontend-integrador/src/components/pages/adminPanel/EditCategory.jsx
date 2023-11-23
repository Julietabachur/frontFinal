import React, { useState, useEffect } from "react";
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

    const EditCategory = ({
    isOpen,
    onClose,
    categoryToEdit,
    getCategories,
    token,
    }) => {
    const [categoryData, setCategoryData] = useState({
        categoryName: "",
        description: "",
        imageUrl: "",
    });
    const [errors, setErrors] = useState({});
    const [showErrorsLenght, setShowErrorsLenght] = useState(false);
    const [showErrorsBlank, setShowErrorsBlank] = useState(false);

    useEffect(() => {
        // Update the local state when the categoryToEdit prop changes
        setCategoryData({
        categoryName: categoryToEdit.categoryName,
        description: categoryToEdit.description,
        imageUrl: categoryToEdit.imageUrl,
        });
    }, [categoryToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Transforma el nombre a mayúsculas si el campo es "categoryName"
        const transformedValue = name === "categoryName" ? value.toUpperCase() : value;

        setCategoryData({ ...categoryData, [name]: transformedValue });
        // Validaciones para el campo categoryName
    if (name === "categoryName") {
        const categoryNameErrors = {};

        if (transformedValue.length < 3 || transformedValue.length > 30) {
            setShowErrorsLenght(true);
            categoryNameErrors.lengthError =
            "El nombre de la categoría debe tener entre 3 y 30 caracteres.";
        }
        if (!transformedValue.trim()) {
            setShowErrorsBlank(true);
            categoryNameErrors.blankError =
            "El nombre de la categoría no puede estar en blanco.";
        }
        setErrors({ ...errors, categoryName: categoryNameErrors });
    }
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

    const handleCancel = () => {
        
        onClose(); // Cerrar el modal
    };

    
    return (
        <Modal isOpen={isOpen} onClose={handleCancel}>
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
            {errors.categoryName && errors.categoryName.lengthError && (
            <div style={{ color: "red" }}>{errors.categoryName.lengthError}</div>
            )}
            {errors.categoryName && errors.categoryName.blankError && (
            <div style={{ color: "red" }}>{errors.categoryName.blankError}</div>
            )}
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
            <Button onClick={handleEditCategory } marginRight={5}>Guardar y Cerrar</Button>
            <Button onClick={handleCancel}>Cancelar</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
};

export default EditCategory;
