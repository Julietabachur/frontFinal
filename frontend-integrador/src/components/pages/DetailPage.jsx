import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

import "react-datepicker/dist/react-datepicker.css";
import "./home/Detail.css";
import { FcShare } from "react-icons/fc";
import {
  HStack,
  VStack,
  Image,
  Input,
  Text,
  Box,
  Button,
  IconButton,
  Stack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
import ProductGallery from "./ProductGallery";
import InfoComponent from "../infoComponent";
import { useProductContext } from "./home/Global.context";
import axios from "axios";
import Specs from "./Specs";
import SocialShare from "./SocialShare";
registerLocale("es", es);
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Policies from "./Policies";
import { wrap } from "framer-motion";

const DetailPage = ({username}) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const frontUrl = import.meta.env.VITE_FRONT_URL;
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [reserveList, setReserveList] = useState([]);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isHeartClicked, setHeartClicked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { setFavorites, favorites, currentPage, setCurrentPage, setAddProductSuccessful, addProductSuccessful , clientId, setReservation,setIsSignIn, saveCarrito, updateCarrito, setCarrito, carrito, size, setSize } =
    useProductContext();
  const [showError, setShowError] = useState(false);
  const [selectedSize, setSelectedSize] = useState(false);
  const [sizeNotSelected, setSizeNotSelected] = useState(false);
  // const [addSuccessful, setAddSuccessful] = useState(false);

  // Verificar si el item.id está en el array de favoritos
  const isFavorite = favorites.includes(id);

  // Confirma si 'riskkojwt' existe, es decir, si la persona ya está registrada.
  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  const increment = () => {
    if (quantity < detail.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  useEffect(() => {
    // Actualizar el estado del corazón basado en si el id está en favoritos
    const isFavorite = favorites.includes(id);
    setHeartClicked(isFavorite);
  }, [id])


  const handleGallery = () => {
    onOpen()
  };

  const addToCart = (product) =>{
    debugger
    if (!size) {
      setSizeNotSelected(true); 
      return; 
    }
  
    setSizeNotSelected(false)
    
    // Crear un objeto ProductDto
    const productoDto = {
      productId: product.productId,
      productName: product.productName,
      thumbnail: product.thumbnail,
      amount: quantity, // Cantidad seleccionada
      size: size,       // Talla seleccionada
      price: product.precio, // Precio unitario
    };
    
    console.log('Agregando producto al carrito: ', productoDto);
   
      const { products } = carrito;
  
      // Validar si el producto con el mismo ID y talla ya existe
      const existingProductIndex = products.findIndex(
        (p) => p.productId === productoDto.productId && p.size === productoDto.size
      );
  
      let updatedProducts;
  
      if (existingProductIndex > -1) {
        // Producto con el mismo ID y talla ya existe, actualizar cantidad
        updatedProducts = [...products];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          amount: updatedProducts[existingProductIndex].amount + productoDto.amount,
        };
      } else {
        // Producto no existe con la misma talla, agregarlo
        updatedProducts = [...products, productoDto];
      }
  
      // Calcular nuevo precio total
      // const newTotalPrice = updatedProducts.reduce(
      //   (acc, prod) => acc + prod.price * prod.amount,
      //   0
      // );
  
      const newCarrito = {
        ...carrito,
        products: updatedProducts,
        // totalPrice: newTotalPrice,
        idUser: clientId, // Asignar clientId
      };

    // Actualizar el estado del carrito
    if (carrito.products.length != 0) {
        updateCarrito(newCarrito)        
        console.log('Carrito actualizado: ', carrito);
    }else{
      saveCarrito(newCarrito)
      console.log('Carrito actualizado: ', carrito);
    }
    
  }

  // useEffect(() => {
  //   getReserved();
  // }, [reserveList]);

  // useEffect(() => {
  //   getReserveList();
  // }, [detail]);

  const handleHeartClick = (event) => {
    // Cambiar el estado del clic del corazón
    setHeartClicked(!isHeartClicked);

    // Actualizar favoritos según el estado del corazón
    const updatedFavorites = isHeartClicked
      ? favorites.filter((productId) => productId !== id) // Quitar de favoritos si estaba
      : [...favorites, id]; // Agregar a favoritos si no estaba

    setFavorites(updatedFavorites);
  };

  const getDetail = async () => {
    const response = await axios.get(
      `${baseUrl}/api/v1/public/products/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      setDetail(response.data);
      console.log('detail producto',response.data);
      
    }
  };

  useEffect(() => {
    getDetail();
    console.log('talle cuando carg la pagina: ', size);
    setSize('')
    
  }, []);

  const handleSize = (talle)=>{
    if(!selectedSize){
        setSize(talle)
    }else {
      setSize('')
    }
    
  }

  const navigateBackwards = () =>{
    debugger
    console.log('current page en detail antes de ir atras: ', currentPage);
    setCurrentPage(currentPage)
    console.log('current page en detail despues de ir atras: ', currentPage);

    setTimeout(() => {
      navigate(-1)      
    }, 1000);
  }

  return (
    <>
      <VStack
        m={1}
        w={"98vw"}
        display={"flex"}
        justifyContent={"center"}
        px={20}
        py={4}
      >
        {detail && (
          <VStack
            spacing={4}
            color={"negro"}
            w={"70vw"}
            justifySelf={"center"}
          >
            <HStack
              justify={"space-between"}
              w={"100%"}
              h={"60px"}
              color={"negro"}
              // borderBottom={"1px solid"}
              // borderColor={'color'}
              alignContent={"center"}
              justifyContent={"space-between"}
              padding={"5px"}
              pb='10'
              minW={"300px"}
            >
              <HStack ml={3} w="50%">              
             
              </HStack>
              <HStack display={'flex'} justifyContent={'center'} alignContent={'center'} wrap={'wrap'}>               
                <Button
                  onClick={() => navigateBackwards()}
                  color={"color"}
                  p={3}
                  px={5}
                  borderRadius={0}
                  variant={"plain"}
                  _hover={{
                    cursor: "pointer", // Cambia el cursor al pasar por encima
                    fontWeight:'bold',
                    borderBottom:'1px solid',
                    borderColor:' color'
                    }}
                >
                  ATRÁS
                </Button>
              </HStack>
            </HStack>
            <VStack  p={2}>
             
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                h={["auto"]}
                w={["auto", "100%"]}
                gap={4}
                p={4}
              >
                {/* Detalles del producto (columna derecha en pantallas grandes, arriba en pantallas pequeñas) */}
                <VStack
                  order={{ base: 1, md: 2 }}  // Coloca los detalles primero en pantallas pequeñas
                  align="start"
                  spacing={4}
                >
                  {/* Nombre del producto */}
                  <Text fontSize="2xl" fontWeight="bold">{detail.productName}</Text>

                  {/* DETALLE PRODUCTO */}
                  <VStack  alignItems={'start'}>
                    <Text  fontFamily="Roboto" fontWeight={"medium"} color="black" fontSize={["10px", "12px"]}>

                    Descripción del producto:
                    </Text>
                    <Text
                      fontFamily={"Roboto"}
                      color={"black"}
                      fontSize={["8px","12px"]}
                      marginTop={["3px","6px"]}
                    >
                      {detail.detail}
                    </Text>
                  </VStack>
                  
                  {/* Precio del producto */}
                  <Text fontSize="xl" color="gray.500">{`$${detail.precio}`}</Text>
                      
                  {/* Talles */}                
                  {username && detail.features && detail.features.find(f => f.charName === "TALLE")?.charValue && (
                    <VStack alignItems={'start'}>
                      <HStack spacing={2} >
                        {detail.features.find(f => f.charName === "TALLE").charValue.map((talle, index) => (
                          <Button
                            key={index}
                            // variant={size === talle ? "solid" : "outline"}              
                            backgroundColor={size === talle ? "color" : "white"}     
                            color={size === talle ? "white" : "black"}     
                            border={'1px solid'}
                            borderColor={'color'}  
                            onClick={()=>handleSize(talle)}
                            _hover={{cursor:'pointer', backgroundColor:'color', color:'white'}}
                          >
                            {talle}
                          </Button>
                        ))}
                      </HStack>                      
                        {sizeNotSelected && 
                        <Text fontSize="sm" fontWeight="medium" color={'red'}>Este es un campo obligatorio.</Text>
                      }
                    </VStack>
                  )}
             
                    {/* CANTIDAD */}
                    {username &&
                    <Box mt={4}>
                      <Text fontSize="sm" fontWeight="semibold">Cantidad:</Text>
                      <HStack mt={2}>
                        <Button 
                          size="sm" 
                          onClick={decrement} 
                          isDisabled={quantity === 1}
                          backgroundColor={"white"}     
                          color={"black"}     
                          border={'1px solid'}
                          borderColor={'color'}  
                          _hover={{cursor:'pointer', backgroundColor:'color', color:'white'}}
                        >
                          -
                        </Button>
                        <Text fontSize="lg" fontWeight="semibold">{quantity}</Text>
                        <Button 
                          size="sm" 
                          onClick={increment} 
                          isDisabled={quantity === detail.stock}
                          backgroundColor={"white"}     
                          color={"black"}     
                          border={'1px solid'}
                          borderColor={'color'}  
                          _hover={{cursor:'pointer', backgroundColor:'color', color:'white'}}
                        >
                          +
                        </Button>
                      </HStack>
                      <Text fontSize="xs" mt={1} color="gray.500">
                        Stock disponible: {detail.stock}
                      </Text>
                    </Box>
                    }

                  {/* exito addtocart */}
                      {addProductSuccessful &&

                        <Box backgroundColor={'green.100'} p={5} fontWeight={'normal'} rounded="md">
                          <Text>El producto fue agregado al carrito con éxito.</Text>
                        </Box>
                    }
                  {/* Botón agregar al carrito */}
                  {username &&
                    <Button
                      onClick={() => addToCart(detail)}
                      // colorScheme="teal"
                      backgroundColor={'white'}
                      variant="solid"
                      width="250px"                      
                      border={'1px solid'}
                      borderColor={'color'}
                      marginTop={6}
                      _hover={{
                        backgroundColor:'color',
                        color:'white'
                      }}
                    >
                      AGREGAR AL CARRITO
                    </Button>
                  }

                  
                  {/* Botones de "like" y "compartir" */}
                  <HStack spacing={4}>
                 
                    
                    {/* Botón de compartir */}
                    <IconButton
                      icon={<FcShare />}
                      aria-label="Share"
                      variant="outline"
                      size="md"
                      onClick={() => setOpenShareModal(true)}
                    />

                       {/* Corazón */}
                       {username && (
                      <Box
                        onClick={handleHeartClick}
                        color={isFavorite ? "red.500" : "gray.400"}
                        _hover={{ color: isFavorite ? "red.600" : "gray.500", cursor: "pointer" }}
                      >
                        {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                      </Box>
                    )}
                  </HStack>
                  
                
                </VStack>

                {/* Imagen del producto (columna izquierda en pantallas grandes, abajo en pantallas pequeñas) */}
                <Box order={{ base: 2, md: 1 }}>
                  <Image
                    src={detail.thumbnail}
                    alt={detail.productName}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    maxH={ "700px"} // Ajusta la altura máxima en diferentes pantallas
                  />
                </Box>
              </Grid>

              {/* btn ver más fotos + modal galeria */}
              {Array.isArray(detail.gallery) && detail.gallery.length != 0 && (
                <HStack justifyContent={'start'} display={"flex"} alignSelf="flex-start">
                  <Button
                    onClick={handleGallery}
                    color={"color"}
                    p={3}
                    px={5}
                    borderRadius={0}
                    variant={"plain"}
                    _hover={{
                      cursor: "pointer", // Cambia el cursor al pasar por encima
                      fontWeight:'bold',
                      borderBottom:'1px solid',
                      borderColor:' color'
                      }}
                  >
                    VER MÁS
                  </Button>
                  <Drawer onClose={onClose} isOpen={isOpen} size={"full"}>
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader>{`Galería de Imágenes`}</DrawerHeader>
                      <DrawerBody>
                        <SimpleGrid minChildWidth="400px" spacing="20px">
                          {detail.gallery.map((img, index) => (
                            <Box key={index}>
                              <Image
                                w={"100%"}
                                h={"100%"}
                                objectFit={"cover"}
                                src={img}
                                alt="photo"
                              />
                            </Box>
                          ))}
                        </SimpleGrid>
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                </HStack>
              )}
            </VStack>
         
            <Specs detail={detail}></Specs>

            
            <InfoComponent/>
            {/* <Policies></Policies> */}
          </VStack>
        )}
      </VStack>
      {openShareModal && (
        <SocialShare
          openShareModal={openShareModal}
          setOpenShareModal={setOpenShareModal}
          detail={detail}
          shareTitle={detail.productName}
          shareText={detail?.detail}
          shareImage={detail.thumbnail}
          shareUrl={`${frontUrl}/detalle/${id}`}
        />
      )}
      ;
    </>
  );
};

export default DetailPage;
