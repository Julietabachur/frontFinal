import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from 'nanoid';
import {
  HStack,
  VStack,
  Image,
  Input,
  Text,
  Textarea,
  Box,
  Button,
  Stack,
  Flex,
  List,
  ListItem,
  Select,
  Heading,
  FormLabel,
  Spacer,
  CloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";

const initialProductState = {
  productName: "",
  category: "",
  detail: "",
  thumbnail: "",
  gallery: [],
  features: [],
};


const NewProduct = ({ token, productToEdit, showSuccess, setShowAddProduct, setShowProdList }) => {


  const baseUrl = import.meta.env.VITE_SERVER_URL;
  //const [isEditing, setIsEditing] = useState(false); // Nuevo estado para el modo edición
  const [productData, setProductData] = useState(initialProductState);
  const [nombreValido, setNombreValido] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [closeForm, setCloseForm] = useState(false);
  const [categoryListAll, setCategoryListAll] = useState([]); // array de lista de categorias
  const [galleryUrl, setGalleryUrl] = useState("");

  const navigate = useNavigate();

  //console.log("COMIENZA NEW PRODUCT");

  //console.log("ProductToEdit: ", productToEdit);


   // LOGICA DE getCategoriesAll- LISTAR todas las categorias sin paginacion para usarlas en el select de productForm y EditProduct
  //no se precisa el token porque es publico
  const getCategoriesAll = async () => {
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de productos
        `${baseUrl}/api/v1/public/category/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
        setCategoryListAll(response.data);
        //console.log("Datos recibidos:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

   //LOGICA de getFeaturesAll. Listar TODAS Caracteristicas.
   const [featuresList, setFeaturesList] = useState([]);

   const getFeaturesAll = async () => {
     try {
       const response = await axios.get(
         //Petición GET a la api del listado de caracteristicas
         `${baseUrl}/api/v1/public/char/all`,
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );
       if (response.data) {
         // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
         setFeaturesList(response.data);
       }
     } catch (error) {
       //Manejo de errores
       console.error(error);
     }
   };

  //para llamar a todas las categorias y features
  useEffect(() => {
    getCategoriesAll();
    getFeaturesAll();
    console.log("GET CATEGORIES AND FEATURES");
  }, []);


  

  // LOGICA PARA VERIFICAR NOMBRE NO ESTE DUPLICADO >>>
  // Parte 1 - Llamado a la API del nombre
  const checkProductName = async (name, e) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/products/productName?productName=${name}`,
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

  //Parte 2 - Preparamos una demora para no estar llamando multiples veces a la api.

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

  const debouncedCheckProductName = debounce(checkProductName, 2000); //2 segundos en millisegundos

  //Parte 3- al hacer un onChange, llama a debounceCheckProductName 
  const handleName = (e) => {
    const productName = e.target.value;
    debouncedCheckProductName(productName, e);
  };

  //Parte 4 - Si cambia el estado de nombre válido, elimina o muestra mensajes de error y activa o desactiva el form.
  useEffect(() => {
    if (!nombreValido) {
      setShowError(true);
      setFormDisabled(true);
    } else {
      setShowError(false);
      setFormDisabled(false);
    }
  }, [nombreValido]);

  // <<< FIN LOGICA CHECK NAME.


  // LOGICA de actualización de valores de atributos en productData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue(value);
    setProductData({ ...productData, [name]: value });
  };


  // LOGICA MANEJO GALERIA IMAGENES
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


  // LOGICA MANEJO CARACTERISTICAS

  const [newFeature, setNewFeature] = useState("");
  const [newFeatureValue, setNewFeatureValue] = useState("");

  const handleAddCharacteristic = () => {
    if (newFeature && productToEdit !== null) {
      const existingFeatureIndex = productData.features.findIndex((feature) => feature.charName === newFeature);

      if (existingFeatureIndex !== -1) {
        // La característica ya existe, actualiza el array de charValue si es diferente
        const updatedFeatures = [...productData.features];
        const existingFeature = updatedFeatures[existingFeatureIndex];

        if (!existingFeature.charValue.includes(newFeatureValue)) {
          // Agrega el nuevo valor solo si no existe en el array charValue
          existingFeature.charValue.push(newFeatureValue);

          setProductData((prevState) => ({
            ...prevState,
            features: updatedFeatures,
          }));
        }
      } else {
        // La característica no existe, agrégala como una nueva
        const selectedFeature = featuresList.find((feature) => feature.charName === newFeature);

        setProductData((prevState) => ({
          ...prevState,
          features: [
            ...prevState.features,
            { id: nanoid(), charIcon: selectedFeature.charIcon, charName: newFeature, charValue: [newFeatureValue] },
          ],
        }));
      }

      setNewFeature("");
      setNewFeatureValue("");
    }
  };


  const handleRemoveCharacteristic = (id) => {
    // Encuentra el índice del elemento con el id dado
    const indexToRemove = productData.features.findIndex((feature) => feature.id === id);

    if (indexToRemove !== -1) {
      // Crea una copia del array sin el elemento a eliminar
      const updatedFeatures = [...productData.features.slice(0, indexToRemove), ...productData.features.slice(indexToRemove + 1)];

      // Actualiza el estado
      setProductData({ ...productData, features: updatedFeatures });
    }
  };


  // LOGICA PARA EL GUARDADO DE DATOS
  const saveChanges = async () => {

    if (!productToEdit) {
      
      //console.log("PRODUCT DATA AGREGAR:" , productData);

    // Realiza la solicitud POST al endpoint para agregar el producto usando Axios
    axios.post(`${baseUrl}/api/v1/admin/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Producto agregado con éxito:", response.data);
        getProducts();
        window.alert("Producto agregado con exito");        
      })
      .catch((error) => {
        // Maneja el error de la solicitud POST aquí - VERIFICAR.
        alert("Error al agregar producto!");
        console.error("Error al agregar el producto:", error);
        // Muestra un mensaje de error al usuario
      });

    } else {

      //console.log("PRODUCT DATA EDITAR:" , productData);

    // Realiza la solicitud PUT al endpoint para actualizar el producto usando Axios
    axios.put(`${baseUrl}/api/v1/admin/products/${productToEdit.id}`, productData, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log('Producto actualizado con éxito:', response.data);
        alert("Producto actualizado con exito")

        setProductData(initialProductState);
        navigate("/admin");
      })
      .catch((error) => {
        // Maneja el error de la solicitud POST aquí
        console.error('Error al actualizar el producto:', error);
        alert("No se pudo modificar el producto, verifique la informacion")
        // Muestra un mensaje de error al usuario 
      });
     //};

    }

    setCloseForm(true);
    navigate('/admin', { replace: true });
  };




  useEffect(() => {
    if (productToEdit) {
      setProductData(productToEdit);
    } else {
      setProductData(initialProductState);
    }
  }, [productToEdit]);


  const handleCancel = () => {
    setProductData(initialProductState);
    setCloseForm(true);
    setShowProdList(false);
    setShowAddProduct(false);
    navigate('/admin', { replace: true });

  };


  return (

    closeForm === false && (

      <VStack
      display={"flex"}
      w={"80%"}
      bg={"gray.200"}
      shadow="md"
      border={"2px solid green"}
      justifyContent={"flex-start"}
      m={10}>

        <Box
          w="100%"
          bg="green.200"
          display="flex"
          flexDirection="column"
          alignItems="flex-end"  
        >
          <CloseButton
            w="14px"
            onClick={() => handleCancel()}
            mx={4}
            _hover=""
          />
  
          <Heading
            fontFamily="Saira"
            fontWeight={"bold"}
            fontSize="1.3rem"
            letterSpacing={1}
            textAlign="center"
            w="100%"
            mb={5}
          >
            {productToEdit ? "EDITAR PRODUCTO" : "AGREGAR PRODUCTO"}
          </Heading>
        </Box>

        <Box w={"100%"}
          /*border={"1px solid black"}*/
          alignContent={"center"}
          px={8}
          minW={"300px"}>
        <Text fontFamily={"Saira"} m={1} fontSize="1rem" fontWeight="semibold">
        Nombre del producto:
        </Text>
        <HStack spacing={3}>
          <Input
          border={"1px solid black"}
            name="productName"
            p={3}
            fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
            placeholder="Nombre del producto"
            defaultValue={productData.productName}
            onChange={(e) => handleName(e)}
          />
          {showError && (
            <Text color="red" fontFamily={"Saira"} fontSize="0.8rem" fontWeight="bold" p={2}>
              ¡El nombre del producto ya existe en la base de datos. Debe elegir otro nombre!
            </Text>
          )}
        </HStack>
      </Box>

      <Box w={"100%"}
          /*border={"1px solid black"}*/
          alignContent={"center"}
          padding={8}
          minW={"300px"} >
        <Text fontFamily={"Saira"} m={1} fontSize="1rem" fontWeight="semibold">
          Categoría del producto:
        </Text>
        <Select
        borderColor={"black"} 
          name="category"
          fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
          placeholder="Selecciona una categoría"
          value={productData.category}
          disabled={formDisabled}
          onChange={handleInputChange}
        >
          {categoryListAll?.map((category) => (
            <option key={category.id} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </Select>
      </Box>

      <Box w={"100%"}
          /*border={"1px solid black"}*/
          alignContent={"center"}
          padding={8}
          minW={"300px"}>
          <Text fontFamily={"Saira"} m={1} fontSize="1rem" fontWeight="semibold">
            Descripción del producto:
          </Text>
            <Textarea
            border={"1px solid black"}
            p={3}
            fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
              name="detail"
              placeholder="Descripción del producto"
              defaultValue={productData.detail}
              disabled={formDisabled}
              onChange={handleInputChange}
              rows={7}
            />
      </Box>

      <Box w={"100%"}
          /*border={"1px solid black"}*/
          alignContent={"center"}
          padding={8}
          minW={"300px"}>
        <Text fontFamily={"Saira"} m={1} fontSize="1rem" fontWeight="semibold">
            Thumbnail - Imagen miniatura:
        </Text>

        <Input
            name="thumbnail"
            border={"1px solid black"}
            fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
            placeholder="Enlace de la miniatura"
            defaultValue={productData.thumbnail}
            disabled={formDisabled}
            onChange={handleInputChange}
          />
      </Box>

      <Box w={"100%"}
      /*border={"1px solid black"}*/
      alignContent={"center"}
      padding={8}
      minW={"300px"}>
          
          <Text fontFamily={"Saira"} m={1} fontSize="1rem" fontWeight="semibold">
            Galería de Imágenes:
          </Text>

          <HStack align="center" mb={3}>
            <Input
            border={"1px solid black"}
              flex="1"
              fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
              placeholder="Enlace imágenes de la galería"
              value={galleryUrl}
              disabled={formDisabled}
              onChange={(e) => setGalleryUrl(e.target.value)}
          
            />
            <Button colorScheme="green" disabled={formDisabled} onClick={handleAddGalleryImage}>+</Button>
          </HStack>

          <Box>
            <List>
              {productData.gallery.map((image, index) => (
                <Flex key={index} align="center">
                  <ListItem py={3} ml={4} flex="1">
                    <Text fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal">
                      <span>✔ - </span>
                    <a href={image} target="_blank" rel="noopener noreferrer">
                      {image}
                    </a>
                    </Text>
                  </ListItem>
                  <Button
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
      </Box>
        
      <Box w={"100%"}
       /*border={"1px solid black"}*/
       alignContent={"center"}
       padding={8}
       minW={"300px"}>

          <Text fontFamily={"Saira"} m={1} fontSize="1rem" fontWeight="semibold">
            Características del producto
          </Text>
          
          <HStack align="center" mb={3}>
            <Select 
            fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
              borderColor={"black"} 
              placeholder="Seleccione una característica"
              value={newFeature}
              disabled={formDisabled}
              onChange={(e) => setNewFeature(e.target.value)}
            >
              {featuresList.map((feature) => (
                <option key={feature.charName} value={feature.charName} >
                  {feature.charName}
                </option>
              ))}
            </Select>
            <Input
            fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
              border={"1px solid black"} 
              placeholder="Nuevo valor para la característica"
              value={newFeatureValue}
              disabled={formDisabled}
              onChange={(e) => setNewFeatureValue(e.target.value)}
            />

            <Button 
            colorScheme="green" 
            disabled={formDisabled} 
            onClick={handleAddCharacteristic}>
              +
            </Button>

          </HStack>

          <Box my={2} >
            <List >
              {productData.features && productData.features.map((prodFeature) => (
                <Flex key={prodFeature.id} align="center" my={2}  >
                  <HStack
                  ml={4}
                  >
                    <Text fontFamily="Saira" color="black" fontSize="1rem">
                      {prodFeature.charIcon}
                    </Text>
                    <Text
                      fontFamily={"Saira"} fontSize="0.9rem" fontWeight="normal"
                    >
                      {prodFeature.charName}
                    </Text >
                    {prodFeature.charValue && prodFeature.charValue.map((value, valueIndex) => (
                      <Text
                        key={valueIndex}
                        fontFamily="Saira"
                        fontSize="0.9rem"
                        ml={2}
                      >
                        {value}
                      </Text>
                    ))}
                  </HStack>
                  <Button
                    size="sm"
                    ml={5}
                    colorScheme="red"
                    onClick={() => handleRemoveCharacteristic(prodFeature.id)}
                    disabled={formDisabled}
                  >
                    X
                  </Button>
                </Flex>
              ))}
            </List>
          </Box>
      </Box>


      <HStack
      w={"100%"}
      bg={"green.200"}
      p={8}
      >
        {productToEdit ? (
          <Button onClick={saveChanges} bg={"verde2"} fontFamily={"Saira"} fontSize="1rem" fontWeight="semibold"  alignSelf={"flex-end"}>Guardar Cambios</Button>

        ) : (
          <Button onClick={saveChanges} bg={"verde2"} fontFamily={"Saira"} fontSize="1rem" fontWeight="semibold" alignSelf={"flex-end"}>Agregar</Button>

        )}

        <Button fontFamily={"Saira"} fontSize="1rem" fontWeight="semibold" onClick={() => handleCancel()}>Cancelar</Button>
      </HStack>

      </VStack>

   

    )

  );

};

export default NewProduct;
