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
} from "@chakra-ui/react";

import ListAdminProduct from "./ListAdminProduct";

const initialProductState = {
  productName: "",
  size: "",
  type: "",
  productionTime: "",
  collection: "",
  thumbnail: "",
  detail: "",
  gallery: [],
};

const ProductForm = ({ isOpen, onClose, productToEdit, addProduct, getProducts, lista, isModalOpen, setIsModalOpen, page, handlePageChange }) => {
  //CAMBIE AL TOKEN MIO CAMBIALO CUANDO PRUEBES VOS
  const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJjbGllbnROYW1lIjoiYWRtaW4xIiwic3ViIjoiYWRtaW4xQGFkbWluMS5jb20iLCJpYXQiOjE2OTg1OTY2MjYsImV4cCI6MTY5OTIwMTQyNn0.lEN5fevoixjN4WXzCC3iSn9P4XTkoMfoDmpALGvbEPE";
  const [productData, setProductData] = useState(initialProductState);
  const [inputValue, setInputValue] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [nombreValido, setNombreValido] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);
  const [showError, setShowError] = useState(false);

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
      if(response.data){
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

  /* en el input , onChange le pasamos handleName pero
  la demoramos 2 segundos para que no este haciendo el
  llamado en cada dato ingresado sino  despues de una demora
    de 2 segundos sin ingresar dato */
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

  // Maneja el botón Agregar/GuardarCambios del formulario segun sea agregar o editar prodocto.
  const handleProductForm = () => {
    console.log("Datos Formulario:", productData);


    console.log('Props before adding a product:', isOpen, onClose, lista, isModalOpen, page);
    addProduct(productData);
    getProducts();
    console.log('Props after adding a product:', isOpen, onClose, lista, isModalOpen, page);
    

     // Cierra el modal y resetea el formulario
     setIsModalOpen(false);
     onClose();
     setProductData(initialProductState);
     setInputValue(""); // Reinicia el valor del input
     setNombreValido(true); // Reinicia la validación del nombre
     setShowError(false); // Reinicia el estado de error
    
  };
  useEffect(() => {
    console.log('Component re-rendered');
  }, [lista]);
  
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
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ModalOverlay />
      <ModalContent mt={200}>
        <ModalHeader>Agregar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Formulario para agregar producto */}

          <Input
            name="productName"
            mb={3}
            placeholder="Nombre del producto"
            defaultValue={productData.productName}
            onChange={handleName}
          />

          {showError && (
            <Text color="red" fontSize="sm" mt={1}>
              ¡El nombre del producto ya existe en la base de datos!
            </Text>
          )}

          <Select
            name="size"
            mb={3}
            placeholder="Selecciona una talla"
            value={productData.size}
            disabled={formDisabled}
            onChange={handleInputChange}
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </Select>
          <Select
            name="type"
            mb={3}
            placeholder="Selecciona un tipo"
            value={productData.type}
            disabled={formDisabled}
            onChange={handleInputChange}
          >
            <option value="T_SHIRT">T_SHIRT</option>
            <option value="SHIRT">SHIRT</option>
            <option value="SKIRT">SKIRT</option>
            <option value="JACKET">JACKET</option>
            <option value="PANT">PANT</option>
            <option value="ACCESORY">ACCESORY</option>
          </Select>
          <NumberInput>
            <NumberInputField
              name="productionTime"
              mb={3}
              disabled={formDisabled}
              placeholder="Cantidad de días para la fábricación"
              value={productData.productionTime}
              onChange={(valueString) => {
                // Convierte el valor de cadena a número antes de pasarlo a handleInputChange
                handleInputChange({
                  target: {
                    name: "productionTime",
                    value: parseInt(valueString, 10),
                  },
                }); //10 base decimal
              }}
            />
          </NumberInput>
          <Input
            name="collection"
            mb={3}
            placeholder="Colección"
            value={productData.collection}
            disabled={formDisabled}
            onChange={handleInputChange}
          />
          <Input
            name="detail"
            mb={3}
            disabled={formDisabled}
            placeholder="Detalle:\nprimer renglón\nsegundo renglón"
            value={productData.detail}
            onChange={handleInputChange}
          />
          <Input
            name="thumbnail"
            mb={3}
            placeholder="Enlace de la miniatura"
            value={productData.thumbnail}
            disabled={formDisabled}
            onChange={handleInputChange}
          />
          <Flex align="center" mb={3}>
            <Input
              flex="1"
              placeholder="Enlace de la imagen de la galería"
              value={galleryUrl}
              disabled={formDisabled}
              onChange={(e) => setGalleryUrl(e.target.value)}
              marginRight={2}
            />
            <Button disabled={formDisabled} onClick={handleAddGalleryImage}>+</Button>
          </Flex>
          <Box mb={3}>
            <Text fontSize="sm" fontWeight="bold">
              Galería de Imágenes:
            </Text>
            <List>
              {productData.gallery.map((image, index) => (
                <Flex key={index} align="center">
                  <ListItem flex="1">
                    <a href={image} target="_blank" rel="noopener noreferrer">
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
                    -
                  </Button>
                </Flex>
              ))}
            </List>
          </Box>

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
    {console.log("isModalOpen:",isModalOpen)}
    {lista && !isModalOpen && <ListAdminProduct isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} getProducts={getProducts} page={page} handlePageChange={handlePageChange} lista={lista}/>}
    </>
  );
};

export default ProductForm;
