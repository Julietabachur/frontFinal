import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  NumberInput,
  NumberInputField,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  List,
  ListItem,
  Text,
  Box,
  Textarea,
} from "@chakra-ui/react";

import ListAdminProduct from "./ListAdminProduct";

const initialProductState = {
  productName: "",
  thumbnail: "",
  gallery: [],
  Detail: "",
  features: [],
  category: "",
};

const ProductForm = ({
  isOpen,
  onClose,
  token,
  categoryListAll,
  featuresListAll,
  addProduct,
  getProducts,
  lista,
  isModalOpen,
  setIsModalOpen,
  page,
  handlePageChange,
}) => {
  const [productData, setProductData] = useState(initialProductState);
  const [inputValue, setInputValue] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [featureAdd, setFeatureAdd] = useState ({})
  const [nombreValido, setNombreValido] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);
  const [showError, setShowError] = useState(false);

  
  const handleFeature = (charName) => {
    const buscarFeature = featuresListAll.find((feature) => feature.charName === charName);
    console.log(buscarFeature);
    setFeatureAdd({charName: buscarFeature.charName, charIcon: buscarFeature.charIcon})
    
  }



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue(value); // Actualiza inputValue en lugar de productData.productName
    setProductData({ ...productData, [name]: value });
    /*  setShowError(!nombreValido || (showError && name === 'productName' && !nombreValido )); */
  };

  //metodo que atrasa la ejecucion de la funcion una medida de tiempo 'delay'
  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const checkProductName = async (name, e) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/products/productName?productName=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNombreValido(response.data);
      if (response.data) {
        const { name, value } = e.target;
        setInputValue(value); // Actualiza inputValue en lugar de productData.productName
        setProductData({ ...productData, [name]: value });
      }
    } catch (error) {
      console.error("Error al hacer la solicitud GET:", error);
      setNombreValido(false);
      setShowError(true);
    }
  };

  //version demorada de del metodo checkName
  const debouncedCheckProductName = debounce(checkProductName, 2000); //2 segundos en millisegundos

  /* en el input , onChange le pasamos handleName perola demoramos 2 segundos para que no este haciendo el
  llamado en cada dato ingresado sino  despues de una demora de 2 segundos sin ingresar dato */
  const handleName = (e) => {
    const productName = e.target.value;
    debouncedCheckProductName(productName, e);
  };

  useEffect(() => {
    if (!nombreValido) {
      setShowError(true);
      setFormDisabled(true);
    } else {
      setShowError(false);
      setFormDisabled(false);
    }
  }, [nombreValido]);

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
  

  const handleRemoveFeature = (index) => {
    const updatedFeature = [...productData.features];
    updatedFeature.splice(index, 1);
    setProductData({ ...productData, features: updatedFeature });
  };

  // Maneja el botón Agregar/GuardarCambios del formulario segun sea agregar o editar prodocto.
  const handleProductForm = () => {
    console.log("Datos Formulario:", productData);
    console.log(productData.features)
    addProduct(productData);
    // Cierra el modal y resetea el formulario
    setIsModalOpen(false);
    onClose();
    setProductData(initialProductState);
    setInputValue(""); // Reinicia el valor del input
    setNombreValido(true); // Reinicia la validación del nombre
    setShowError(false); // Reinicia el estado de error
  };
  /*
  useEffect(() => {
    console.log('Component re-rendered');
  }, [lista]);*/

  const handleCancel = () => {
    // Cierra el modal y resetea el formulario
    onClose();
    setProductData(initialProductState);
    setInputValue(""); // Reinicia el valor del input
    setNombreValido(true); // Reinicia la validación del nombre
    setShowError(false); // Reinicia el estado de error
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancel} size= {'xl'}>
        <ModalOverlay />
        <ModalContent mt={150} maxWidth="50%">
          <ModalHeader>Agregar Producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody borderColor={"black"}>
            <Flex  border={1}
              flexDirection="column"
              p={1}
              gap={5}
              my={1}
              maxHeight="45vh"
              overflowY="scroll"
            >
              {/* Formulario para agregar producto */}

              <Input
                name="productName"
                
                autoComplete={"off"}
                placeholder="Nombre del producto"
                defaultValue={productData.productName}
                onChange={handleName}
              />

              {showError && (
                <Text color="red" fontSize="sm" mt={1}>
                  ¡El nombre del producto ya existe en la base de datos!
                </Text>
              )}

              <Select borderColor={"black"}
                name="category"
                
                placeholder="Selecciona la categoría"
                value={productData.category}
                disabled={formDisabled}
                onChange={handleInputChange}
              >
                {categoryListAll.map((category) => (
                  <option  key={category.id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </Select>

              <Textarea
                name="Detail"
                autoComplete={"off"}
                disabled={formDisabled}
                placeholder="Descripcion del producto:\nprimer renglón\nsegundo renglón"
                value={productData.Detail}
                onChange={handleInputChange}
              />
              <Input
                name="thumbnail"
                autoComplete={"off"}
                mb={3}
                placeholder="Enlace de la imagen miniatura"
                value={productData.thumbnail}
                disabled={formDisabled}
                onChange={handleInputChange}
              />


                <Flex flexDirection={"column"}> 
                <Text mb={3} fontWeight="bold">
                  Caracteristicas del producto:
                </Text>       
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

              
                </Flex>

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
              
                <Text fontWeight="bold">
                  Galería de Imágenes:
                </Text>
                <Flex align="center" mb={3}  borderColor={"black"}>
                <Input
                  flex="1"
                  placeholder="Agregue enlaces de imagenes a la galería"
                  value={galleryUrl}
                  disabled={formDisabled}
                  onChange={(e) => setGalleryUrl(e.target.value)}
                  marginRight={2}
                />
                <Button disabled={formDisabled} onClick={handleAddGalleryImage}>
                  +
                </Button>
              </Flex>

              <Box m={3}>
                <List>
                  {productData.gallery.map((image, index) => (
                    <Flex key={index} align="center" >
                      <ListItem maxWidth="90%" m={3} >
                        <a
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {image}
                        </a>
                      </ListItem>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        borderColor="red.500"
                        onClick={() => handleRemoveGalleryImage(index)}
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
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleProductForm}
              disabled={formDisabled}
            >
              Agregar
            </Button>
            <Button onClick={handleCancel}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {console.log("isModalOpen:", isModalOpen)}
      {console.log("Lista?:", lista)}
      {lista && !isModalOpen && (
        <ListAdminProduct
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          getProducts={getProducts}
          page={page}
          handlePageChange={handlePageChange}
          lista={lista}
        />
      )}
    </>
  );
};

export default ProductForm;
