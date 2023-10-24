import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NumberInput,NumberInputField,Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, Select, List, ListItem, Text, Box } from '@chakra-ui/react';

const initialProductState = {
  productName: '',
  size: '',
  type: '',
  productionTime: '',
  collection: '',
  thumbnail: '',
  detail: '',
  gallery: [],
};

const AddProduct = ({ isOpen, onClose }) => {
  //CAMBIE AL TOKEN MIO CAMBIALO CUANDO PRUEBES VOS
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbjEiLCJpYXQiOjE2OTc5NDUwNzgsImV4cCI6MTY5ODU0OTg3OH0.douNB-2uDgKoKK0IcjRsQqsr2_QW6hK1e8bZRacFMWw"
  const [productData, setProductData] = useState(initialProductState);
  const [inputValue, setInputValue] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [nombreValido,setNombreValido] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue(value); // Actualiza inputValue en lugar de productData.productName
    setProductData({ ...productData, [name]: value });
    setShowError(!nombreValido || (showError && name === 'productName' && !nombreValido));
  };

  useEffect(() => {
    const checkProductName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/admin/products/productName?productName=${inputValue}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNombreValido(!response.data); 
      } catch (error) {
        console.error('Error al hacer la solicitud GET:', error);
        setNombreValido(false);
        setShowError(true);
      }
    };
    if (inputValue) {
      checkProductName();
    } else {
      setNombreValido(false);
      setShowError(true);
    }
  }, [inputValue, token]);

  useEffect(() => {
    setFormDisabled(!nombreValido);
  }, [nombreValido]);

  const handleAddGalleryImage = () => {
    if (galleryUrl) {
      setProductData(prevState => ({
        ...prevState,
        gallery: [...prevState.gallery, galleryUrl]
      }));
      setGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index) => {
    const updatedGallery = [...productData.gallery];
    updatedGallery.splice(index, 1);
    setProductData({ ...productData, gallery: updatedGallery });
  };

  const handleAddProduct = () => {
    // Realiza la solicitud POST al endpoint para agregar el producto usando Axios
    axios.post('http://localhost:8080/api/v1/admin/products', productData,{headers:{Authorization:`Bearer ${token}`}})
      .then((response) => {
        console.log('Producto agregado con éxito:', response.data);
        
        // Cierra el modal y resetea el formulario
        onClose();
        setProductData(initialProductState);
        setInputValue(''); // Reinicia el valor del input
        setNombreValido(false); // Reinicia la validación del nombre
        setShowError(false); // Reinicia el estado de error
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
    setInputValue(''); // Reinicia el valor del input
    setNombreValido(false); // Reinicia la validación del nombre
    setShowError(false); // Reinicia el estado de error
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} >
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
            onBlur={handleInputChange} 
            //isDisabled={formDisabled}
          />

          {showError  && (
            <Text color="red" fontSize="sm" mt={1}>
              ¡El nombre del producto ya existe en la base de datos!
            </Text>
          )}

          <Select name="size" mb={3} placeholder="Selecciona una talla" value={productData.size} isDisabled={!nombreValido} onChange={handleInputChange}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </Select>
          <Select name="type" mb={3} placeholder="Selecciona un tipo" value={productData.type} isDisabled={!nombreValido} onChange={handleInputChange}>
            <option value="T_SHIRT">T_SHIRT</option>
            <option value="SHIRT">SHIRT</option>
            <option value="SKIRT">SKIRT</option>
            <option value="JACKET">JACKET</option>
            <option value="PANT">PANT</option>
            <option value="ACCESORY">ACCESORY</option>
          </Select>
          <NumberInput>
            <NumberInputField name="productionTime" mb={3}
            isDisabled={!nombreValido}
            placeholder="Cantidad de días para la fábricación"
            value={productData.productionTime}
            onChange={(valueString) => {
              // Convierte el valor de cadena a número antes de pasarlo a handleInputChange
              handleInputChange({ target: { name: 'productionTime', value: parseInt(valueString, 10) } }); //10 base decimal
            }}/>
          </NumberInput>
          <Input name="collection" mb={3} placeholder="Colección" value={productData.collection} isDisabled={!nombreValido} onChange={handleInputChange} />
          <Input name="thumbnail" mb={3} placeholder="Enlace de la miniatura" value={productData.thumbnail} isDisabled={!nombreValido} onChange={handleInputChange} />
          <Flex align="center" mb={3}>
            <Input 
              flex="1" 
              placeholder="Enlace de la imagen de la galería" 
              value={galleryUrl} 
              isDisabled={!nombreValido}
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
              {productData.gallery.map((image, index) => (
                <Flex key={index} align="center">
                  <ListItem flex="1">
                    <a href={image} target="_blank" rel="noopener noreferrer">{image}</a>
                  </ListItem>
                  <Button size="sm" colorScheme="blue" variant="outline" borderColor="red.500" onClick={() => handleRemoveGalleryImage(index)}>
                    -
                  </Button>
                </Flex>
              ))}
            </List>
          </Box>

          <Input name="detail" mb={3} placeholder="Detalle:\nprimer renglón\nsegundo renglón" value={productData.detail} onChange={handleInputChange} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAddProduct} isDisabled={formDisabled}>
            Agregar
          </Button>
          <Button onClick={handleCancel} isDisabled={formDisabled}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProduct;

/*
<Input name="productionTime" mb={3} placeholder="Fecha de producción in days" value={productData.productionTime} onChange={handleInputChange} />
          <Input name="collection" mb={3} placeholder="Colección" value={productData.collection} onChange={handleInputChange} />
          <Input name="thumbnail" mb={3} placeholder="Enlace de la miniatura" value={productData.thumbnail} onChange={handleInputChange} />
          <Input placeholder="Enlace de la imagen de la galería" onBlur={handleAddGalleryImage} />
=======
          <NumberInput>
            <NumberInputField name="productionTime" mb={3}
            isDisabled={!nombreValido}
            placeholder="Cantidad de días para la fábricación"
            value={productData.productionTime}
            onChange={(valueString) => {
              // Convierte el valor de cadena a número antes de pasarlo a handleInputChange
              handleInputChange({ target: { name: 'productionTime', value: parseInt(valueString, 10) } }); //10 base decimal
            }}/>
          </NumberInput>
          <Input name="collection" mb={3} placeholder="Colección" value={productData.collection} isDisabled={!nombreValido} onChange={handleInputChange} />
          <Input name="thumbnail" mb={3} placeholder="Enlace de la miniatura" value={productData.thumbnail} isDisabled={!nombreValido} onChange={handleInputChange} />
          <Flex align="center" mb={3}>
            <Input 
              flex="1" 
              placeholder="Enlace de la imagen de la galería" 
              value={galleryUrl} 
              isDisabled={!nombreValido}
              onChange={(e) => setGalleryUrl(e.target.value)} 
              marginRight={2}
            />
            <Button 
              onClick={handleAddGalleryImage}
            >
              +
            </Button>
          </Flex>
*/
