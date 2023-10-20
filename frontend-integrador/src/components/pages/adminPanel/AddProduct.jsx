import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Select, List, ListItem, Text, Box, Alert, AlertIcon } from '@chakra-ui/react';

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const initialProductState = {
  name: '',
  size: '',
  type: '',
  productionTime: '',
  set: '',
  thumbnail: '',
  gallery: [],
};

const AddProduct = ({ isOpen, onClose, onAddProduct }) => {
  const [productData, setProductData] = useState(initialProductState);
  const [error, setError] = useState(null); // Estado para gestionar errores

  // Función para manejar cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value.trim() });
  };

  // Función para agregar imágenes a la galería
  const handleAddGalleryImage = (e) => {
    const { value } = e.target;
    if (value && urlRegex.test(value.trim())) {
      setProductData({ ...productData, gallery: [...productData.gallery, value.trim()] });
    }
  };

  // Función para agregar productos
  const handleAddProduct = () => {
    // Validación de campos nulos y espacios en blanco
    const nullOrWhitespaceFields = Object.values(productData).some(value => value === '' || value.trim() === '');
    if (nullOrWhitespaceFields) {
      setError("Ningún campo puede estar en blanco.");
      return;
    }

    // Validación de nombre y set
    if (productData.name.length < 3 || productData.name.length > 50) {
      setError("El nombre debe tener entre 3 y 50 caracteres.");
      return;
    }

    if (productData.set.length < 3 || productData.set.length > 50) {
      setError("El set debe tener entre 3 y 50 caracteres.");
      return;
    }

    // Validación de URL del thumbnail
    if (!urlRegex.test(productData.thumbnail)) {
      setError("URL del thumbnail no válida.");
      return;
    }

    // Validación de URLs de la galería de imágenes
    const galleryUrlsValid = productData.gallery.every((url) => urlRegex.test(url));
    if (!galleryUrlsValid) {
      setError("Al menos una URL de la galería no es válida.");
      return;
    }

    // Validación del formato de la fecha
    if (!dateRegex.test(productData.productionTime)) {
      setError("Formato de fecha no válido. Debe ser YYYY-MM-DD.");
      return;
    }

    // Restablece el estado de error
    setError(null);

    // Envía datos si las validaciones son exitosas
    onAddProduct(productData);
    onClose();

    // Resetea el formulario
    setProductData(initialProductState);
  };

  // Función para cancelar y cerrar el modal
  const handleCancel = () => {
    // Cierra el modal
    onClose();
    // Resetea el formulario y el estado de error
    setProductData(initialProductState);
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Mostrar errores */}
          {error && (
            <Alert status="error" mb={3}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Formulario para agregar producto */}
          <Input
            name="name"
            mb={3}
            placeholder="Nombre del producto"
            value={productData.name}
            onChange={handleInputChange}
            isInvalid={error && error.includes("nombre")}
          />
          
          {/* Selección de Talla */}
          <Select name="size" mb={3} placeholder="Selecciona una talla" value={productData.size} onChange={handleInputChange}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </Select>
          
          {/* Selección de Tipo */}
          <Select name="type" mb={3} placeholder="Selecciona un tipo" value={productData.type} onChange={handleInputChange}>
            <option value="T_SHIRT">T_SHIRT</option>
            <option value="SHIRT">SHIRT</option>
            <option value="SKIRT">SKIRT</option>
            <option value="JACKET">JACKET</option>
            <option value="PANT">PANT</option>
          </Select>

          <Input 
            name="productionTime" 
            mb={3} 
            placeholder="Fecha de producción en formato YYYY-MM-DD" 
            value={productData.productionTime} 
            onChange={handleInputChange} 
            isInvalid={error && error.includes("fecha")}
          />
          
          <Input
            name="set"
            mb={3}
            placeholder="Set"
            value={productData.set}
            onChange={handleInputChange}
            isInvalid={error && error.includes("set")}
          />
          <Input 
            name="thumbnail" 
            mb={3} placeholder="Enlace de la miniatura" 
            value={productData.thumbnail} 
            onChange={handleInputChange} 
            isInvalid={error && error.includes("thumbnail")}
          />
          
          <Input 
            placeholder="Enlace de la imagen de la galería" 
            onChange={handleAddGalleryImage} 
            isInvalid={error && error.includes("galería")}
          />
          <Box mb={3}>
            <Text fontSize="sm" fontWeight="bold">Galería de Imágenes:</Text>
            <List>
              {productData.gallery.map((image, index) => (
                <ListItem key={index}>
                  <a href={image} target="_blank" rel="noopener noreferrer">{image}</a>
                </ListItem>
              ))}
            </List>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddProduct}>
            Agregar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProduct;

