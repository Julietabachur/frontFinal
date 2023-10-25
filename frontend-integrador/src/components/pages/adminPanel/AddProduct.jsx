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
  Text,
  Select,
  Box,
  List,
  ListItem,
 } from "@chakra-ui/react";

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

const AddProduct = ({ isOpen, onClose, listaOn }) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbjEiLCJpYXQiOjE2OTc5MTE1MDgsImV4cCI6MTY5ODUxNjMwOH0.Ui4Z3777Fcka5v172FHNurtZ7zNRcolHXPib81cgnWI";
  const [productData, setProductData] = useState(initialProductState);
  const [inputValue, setInputValue] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [nombreValido, setNombreValido] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue(value);
    setProductData({ ...productData, [name]: value });
  };

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
        setInputValue(value);
        setProductData({ ...productData, [name]: value });
      }
    } catch (error) {
      console.error("Error al hacer la solicitud GET:", error);
      setNombreValido(false);
      setShowError(true);
    }
  };

  const debouncedCheckProductName = debounce(checkProductName, 2000);

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

  const handleAddProduct = () => {
    axios
      .post("http://localhost:8080/api/v1/admin/products", productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Producto agregado con éxito:", response.data);
        // Actualiza la lista de productos
        if(listaOn){

        }
        onClose();
        setProductData(initialProductState);
        setInputValue("");
        setNombreValido(true);
        setShowError(false);
      })
      .catch((error) => {
        console.error("Error al agregar el producto:", error);
      });
  };

  const handleCancel = () => {
    onClose();
    setProductData(initialProductState);
    setInputValue("");
    setNombreValido(true);
    setShowError(false);
  };

  return (
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
            isDisabled={formDisabled}
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
            isDisabled={formDisabled}
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
              isDisabled={formDisabled}
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
            isDisabled={formDisabled}
            onChange={handleInputChange}
          />
          <Input
            name="thumbnail"
            mb={3}
            placeholder="Enlace de la miniatura"
            value={productData.thumbnail}
            isDisabled={formDisabled}
            onChange={handleInputChange}
          />
          <Flex align="center" mb={3}>
            <Input
              flex="1"
              placeholder="Enlace de la imagen de la galería"
              value={galleryUrl}
              isDisabled={formDisabled}
              onChange={(e) => setGalleryUrl(e.target.value)}
              marginRight={2}
            />
            <Button isDisabled={formDisabled} onClick={handleAddGalleryImage}>+</Button>
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
                    isDisabled={formDisabled}
                  >
                    -
                  </Button>
                </Flex>
              ))}
            </List>
          </Box>

          <Input
            name="detail"
            mb={3}
            iisDisabled={formDisabled}
            placeholder="Detalle:\nprimer renglón\nsegundo renglón"
            value={productData.detail}
            onChange={handleInputChange}
          />
        </ModalBody>
        <ModalFooter>
        <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleAddProduct()} 
            isDisabled={formDisabled}
          >
            Agregar
        </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProduct;
