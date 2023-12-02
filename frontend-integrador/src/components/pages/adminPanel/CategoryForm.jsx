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

    const adminUrl = import.meta.env.VITE_ADMIN_URL;

    const CategoryForm = ({ isModalCategoriaOpen,setIsModalCategoriaOpen, onClose, getCategories, token }) => {
    const [categoryData, setCategoryData] = useState(initialCategoryState);
    const [errors, setErrors] = useState({});
    const[showErrorsLenght, setShowErrorsLenght] = useState(false);
    const[showErrorsBlank, setShowErrorsBlank] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
          // Transforma el nombre a mayúsculas si el campo es "categoryName"
        const transformedValue = name === "categoryName" ? value.toUpperCase() : value;

        setCategoryData({ ...categoryData, [name]: transformedValue });

        // Validaciones para el campo categoryName
    if (name === "categoryName") {
        const categoryNameErrors = {};
        
        if (value.length < 3 || value.length > 30) {
            setShowErrorsLenght (true)
            categoryNameErrors.lengthError = "El nombre de la categoría debe tener entre 3 y 30 caracteres.";
        }
        if (!value.trim()) {
            setShowErrorsBlank(true)
            categoryNameErrors.blankError = "El nombre de la categoría no puede estar en blanco.";
        }
        setErrors({ ...errors, categoryName: categoryNameErrors });
    }
    };

    const handleAddCategory = async () => {
        try{
        const response =await axios.post(
            `${adminUrl}/category`,
            categoryData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Categoría agregada con éxito:", response.data);
            // Actualizar la lista de categorías después de agregar una nueva
            getCategories();
            // Cerrar el modal y resetear el formulario
            onClose();
            setCategoryData(initialCategoryState);
        } catch (error) {
            if (error.response && error.response.status === 400) {
            // Si el error es 400, muestra una alerta con el mensaje de error del servidor
            window.alert(error.response.data.error);
            } else {
            // Para otros errores, muestra un mensaje de error genérico
            console.error("Error al agregar la categoría:", error);
            }
            // Puedes manejar otros errores aquí si es necesario
        }
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
                <ModalHeader>Agregar categoría</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                {/* Formulario para agregar categoría */}
                <Input
                    name="categoryName"
                    mb={3}
                    placeholder="Nombre de la categoría"
                    value={categoryData.categoryName}
                    onChange={handleInputChange}
                    required
                    pattern=".{3,30}"
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
                    placeholder="Enlace de la imagen"
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