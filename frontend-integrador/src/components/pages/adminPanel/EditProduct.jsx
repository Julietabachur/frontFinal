import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Flex, Modal, ModalOverlay,NumberInput, NumberInputField, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Select, List, ListItem, Text, Box, Image, Textarea, FormLabel } from '@chakra-ui/react';
import ProductGallery from "../ProductGallery";

const EditProduct = ({ isOpen, onClose, productToEdit, getProducts,token, getCategoriesAll, categoryListAll, getFeaturesAll, featuresListAll }) => {
  const [productData, setProductData] = useState(productToEdit);
  const [inputValue, setInputValue] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [nombreRepetido, setNombreRepetido] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  
  const handleRemoveFeature = (index) => {
    const updatedFeature = [...productData.features];
    updatedFeature.splice(index, 1);
    setProductData({ ...productData, features: updatedFeature });
  };

  const handleAddGalleryImage = () => {
    if (galleryUrl) {
      setProductData((prevState) => ({
        ...prevState,
        gallery: [...prevState.gallery, galleryUrl],
      }));
      setGalleryUrl("");
    }
  };

  const handleRemoveGalleryImage = (index) => {
    const updatedGallery = [...productData.gallery];
    updatedGallery.splice(index, 1);
    setProductData({ ...productData, gallery: updatedGallery });
  };

  const handleAddFeature = () => {
    if (featureAdd.charName !== "") {
      console.log(featureAdd)
      setProductData((prevState) => ({
        ...prevState,
        features: [...prevState.features, featureAdd],
      }));
      setFeatureAdd({});
    }
  }
  

console.log(productData);
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


  const handleEditProduct = () => {

    // Realiza la solicitud PUT al endpoint para actualizar el producto usando Axios
    axios.put(`http://localhost:8080/api/v1/admin/products/${productToEdit.id}`, productData, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log('Producto actualizado con éxito:', response.data);
        alert("Producto actualizado con exito")
        // Cierra el modal y resetea el formulario
        onClose();
        // vuelve a listar productos
        getProducts();

        //setProductData(initialProductState);
      })
      .catch((error) => {
        // Maneja el error de la solicitud POST aquí
        console.error('Error al actualizar el producto:', error);
        alert("No se pudo modificar el producto, verifique la informacion")
        // Muestra un mensaje de error al usuario 
      });
  };

  /*const handleCancel = () => {
    // Cierra el modal y resetea el formulario
    onClose();
    //setProductData(initialProductState);
  };*/

  return (
    <Modal isOpen={isOpen} onClose={onClose} size= {'xl'} >
      <ModalOverlay />
      <ModalContent mt={150} maxWidth="50%">
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody borderColor={"black"}>
        <Flex border={1}
              flexDirection="column"
              p={1}
              gap={5}
              my={1}
              maxHeight="45vh"
              overflowY="scroll"
            >
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

          <Select borderColor={"black"}
              name="category"
              mb={3}
              placeholder="Selecciona una categoría"
              value={productData.category}
              onChange={handleInputChange}
            >
              {categoryListAll.map((category) => (
                <option key={category.id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </Select>

            <Textarea
            p={"5"}
                name="Detail"
                autoComplete={"off"}
                disabled={formDisabled}
                value={productData.Detail}
                onChange={handleInputChange}
            />

            <Text fontWeight="bold">Imagen miniatura</Text>
            <Input 
            name="thumbnail" 
            mb={3} 
            placeholder="Enlace de la miniatura" 
            value={productData.thumbnail} 
            onChange={handleInputChange} />
            
            
            <Text fontWeight="bold">Galeria de imagenes</Text>
            <Flex align="center" mb={3}>
            <Input
              flex="1"
              placeholder="Agrega el enlace de la imagen para la galería"
              value={galleryUrl}
              onChange={(e) => setGalleryUrl(e.target.value)}
              marginRight={2}
              />
              <Button
              onClick={handleAddGalleryImage}
              >+</Button>
            </Flex>
            
            <Box mb={3} >
            <ProductGallery thumbnail={productData.thumbnail} gallery={productData.gallery} />
            <Text mt={10} fontWeight="bold">Remover imagenes de la galeria</Text>
            <List>
              {productData.gallery.map((image, index) => (
                <Flex key={index} align="center">
                  <ListItem mt={5} flex="1">
                    <Image mb={1} boxSize={"30%"} src={image} alt="image"/>
                    <a href={image} target="_blank" rel="noopener noreferrer">
                      {image}
                    </a>
                  </ListItem>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveGalleryImage(index)}
                    disabled={formDisabled}
                  >
                    X
                  </Button>
                </Flex>
              ))}
            </List>
            </Box>

            <Text mt={10} fontWeight="bold">Caracteristicas del producto</Text>
            <Select
                  borderColor={"black"}
                  name="features"
                  placeholder="Seleccione las caracteristicas que desea agregar"
                  value={featureAdd.charName}
                  disabled={formDisabled}
                  onChange={(e) => handleFeature(e.target.value)}
                  >

                    
                  {featuresListAll.map((feature) => (
                      <option key={feature.id} value={feature.charName}>
                      {feature.charName}
                      {feature.charIcon}
                      </option>
                            
                ))}
                </Select>

                 {featureAdd.charName && (
                   

                  <>
                  {<Input
                  disabled={true}
                  name="charIcon"
                  my={3}
                  defaultValue={featureAdd.charIcon}
                 />}
                 
                  <Input
                  borderColor={"black"}
                  name="charValue"
                  my={3}
                  placeholder="Detalle una descripcion de la caracteristica y luego presione agregar"
                  onChange={(e) => setFeatureAdd({...featureAdd, charValue: [e.target.value]})}
                  />
                  <Button  border={"1px solid black"} disabled={formDisabled} onClick={handleAddFeature}> Agregar</Button>
                  </>
                 )}

            <Text mt={3} fontWeight="bold">Elimina caracteristicas del producto</Text>

            <Box>
                   <List bg={"green.200"}> 
                   {productData.features.map((feature, index) => (
                     <Flex key={index} align="center" >
                       <ListItem maxWidth="90%" m={2} >
                           <Text>{feature.charName} {feature.charIcon} {feature.charValue}</Text>
                       </ListItem>
                       <Button
                         size="sm"
                         colorScheme="blue"
                         variant="outline"
                         borderColor="red.500"
                         onClick={() => handleRemoveFeature(index)}
                         disabled={formDisabled}
                       >
                         X
                       </Button>
                     </Flex>
                   ))}
                 </List>              
              </Box>


        </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleEditProduct}>
            Guardar Cambios
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProduct;
