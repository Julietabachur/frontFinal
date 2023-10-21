
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Select, List, ListItem, Text, Box } from '@chakra-ui/react';

const initialProductState = {
  productName: '',
  size: '',
  type: '',
  productionTime: '',
  collection: '',
  thumbnail: '',
  gallery: [],
};

const AddProduct = ({ isOpen, onClose }) => {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbjEiLCJpYXQiOjE2OTc5MTE1MDgsImV4cCI6MTY5ODUxNjMwOH0.Ui4Z3777Fcka5v172FHNurtZ7zNRcolHXPib81cgnWI"
  const [productData, setProductData] = useState(initialProductState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value.trim() });
  };

  const handleAddProduct = () => {
    // Realiza la solicitud POST al endpoint para agregar el producto usando Axios
    axios.post('http://localhost:8080/api/v1/admin/products', productData,{headers:{Authorization:`Bearer ${token}`}})
      .then((response) => {
        console.log('Producto agregado con éxito:', response.data);
        
        // Cierra el modal y resetea el formulario
        onClose();
        setProductData(initialProductState);
      })
      .catch((error) => {
        // Maneja el error de la solicitud POST aquí
        console.error('Error al agregar el producto:', error);
        // Muestra un mensaje de error al usuario 
      });
  };

  const handleCancel = () => {
    // Cierra el modal y resetea el formulario
    onClose();
    setProductData(initialProductState);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Formulario para agregar producto */}
          <Input name="productName" mb={3} placeholder="Nombre del producto" value={productData.productName} onChange={handleInputChange} />
          <Select name="size" mb={3} placeholder="Selecciona una talla" value={productData.size} onChange={handleInputChange}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </Select>
          <Select name="type" mb={3} placeholder="Selecciona un tipo" value={productData.type} onChange={handleInputChange}>
            <option value="T_SHIRT">T_SHIRT</option>
            <option value="SHIRT">SHIRT</option>
            <option value="SKIRT">SKIRT</option>
            <option value="JACKET">JACKET</option>
            <option value="PANT">PANT</option>
          </Select>
          <Input name="productionTime" mb={3} placeholder="Fecha de producción YYYY-MM-DD" value={productData.productionTime} onChange={handleInputChange} />
          <Input name="collection" mb={3} placeholder="Colección" value={productData.collection} onChange={handleInputChange} />
          <Input name="thumbnail" mb={3} placeholder="Enlace de la miniatura" value={productData.thumbnail} onChange={handleInputChange} />
          <Input placeholder="Enlace de la imagen de la galería" onChange={handleInputChange} />
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
