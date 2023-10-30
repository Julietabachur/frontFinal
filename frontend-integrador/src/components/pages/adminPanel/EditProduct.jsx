import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Select, List, ListItem, Text, Box } from '@chakra-ui/react';


const EditProduct = ({ isOpen, onClose, productToEdit, getProducts,token }) => {
  const [productData, setProductData] = useState(productToEdit);
  const [inputValue, setInputValue] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [nombreRepetido, setNombreRepetido] = useState(false);


  console.log("ProductToEdit:", productToEdit);
  console.log("productData:", productData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue(value); // Actualiza inputValue en lugar de productData.productName
    setProductData({ ...productData, [name]: value });
  };

  useEffect(() => {
    const checkProductName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/products/productName?productName=${inputValue}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNombreRepetido(!response.data);
      } catch (error) {
        console.error('Error al hacer la solicitud GET:', error);
        setNombreRepetido(false);
      }
    };

    if (inputValue) {
      checkProductName();
    } else {
      setNombreRepetido(false);
    }
  }, [inputValue, token]);

  const handleAddGalleryImage = () => {
    if (galleryUrl) {
      setProductData(prevState => ({
        ...prevState,
        gallery: [...prevState.gallery, galleryUrl]
      }));
      setGalleryUrl('');
    }
  };

  const handleEditProduct = () => {

    // Realiza la solicitud PUT al endpoint para actualizar el producto usando Axios
    axios.put(`http://localhost:8080/api/v1/admin/products/${productToEdit.id}`, productData, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log('Producto actualizado con éxito:', response.data);
        
        // Cierra el modal y resetea el formulario
        onClose();
        // vuelve a listar productos
        getProducts();

        //setProductData(initialProductState);
      })
      .catch((error) => {
        // Maneja el error de la solicitud POST aquí
        console.error('Error al actualizar el producto:', error);
        // Muestra un mensaje de error al usuario 
      });
  };

  const handleCancel = () => {
    // Cierra el modal y resetea el formulario
    onClose();
    //setProductData(initialProductState);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent mt={200}>
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Formulario para Editar producto */}

          <Input
            name="productName"
            mb={3}
            defaultValue={productData.productName} //CAMBIE DE VALUE A DEFAULT VALUE ESO TE SACA EL ERROR
            onBlur={handleInputChange}
          />

          {nombreRepetido && (
            <Text color="red" fontSize="sm" mt={1}>
              ¡El nombre del producto ya existe en la base de datos!
            </Text>
          )}

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
          <Input name="productionTime" mb={3} placeholder="Fecha de producción in days" value={productData.productionTime} onChange={handleInputChange} />
          <Input name="collection" mb={3} placeholder="Colección" value={productData.collection} onChange={handleInputChange} />
          <Input name="thumbnail" mb={3} placeholder="Enlace de la miniatura" value={productData.thumbnail} onChange={handleInputChange} />
          <Flex align="center" mb={3}>
            <Input
              flex="1"
              placeholder="Enlace de la imagen de la galería"
              value={galleryUrl}
              onChange={(e) => setGalleryUrl(e.target.value)}
              marginRight={2}
            />
            <Button
              onClick={handleAddGalleryImage}
            >
              +
            </Button>
          </Flex>
          <Box mb={3}>
            <Text fontSize="sm" fontWeight="bold">Galería de Imágenes:</Text>
            <List>
              {productData.gallery && productData.gallery.map((image, index) => (
                <ListItem key={index}>
                  <a href={image} target="_blank" rel="noopener noreferrer">{image}</a>
                </ListItem>
              ))}
            </List>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleEditProduct}>
            Guardar Cambios
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProduct;
