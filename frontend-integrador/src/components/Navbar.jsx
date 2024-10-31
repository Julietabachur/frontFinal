import { useEffect, useState, useCallback } from "react";
import {
  Button,
  HStack,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  ButtonGroup,
  Box,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "./NavbarMenu";
import { useProductContext } from "../components/pages/home/Global.context";
import axios from "axios";

import { HamburgerIcon, Search2Icon } from "@chakra-ui/icons";
import { wrap } from "framer-motion";
import { FaSearch } from "react-icons/fa";


const Navbar = ({ username, setUserName, roles }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [media, setMedia] = useState(false);
  const navigate = useNavigate();
  const GETME_URL = import.meta.env.VITE_GETME_URL;
  const MIN_DESKTOP_WIDTH = 768;

  const {
    categories,
    setCategories,
    getProductsByType,
    currentPage,
    totalElements,
    setProductName,
    productName,
    setPaginatedData
  } = useProductContext();

  const baseUrl = import.meta.env.VITE_SERVER_URL;


  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
      } else {
        setMedia(false);
      }
    };
    if (window.innerWidth < MIN_DESKTOP_WIDTH) {
      setMedia(true);
    } else {
      setMedia(false);
    }

    window.addEventListener("resize", handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/public/category/all`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          setCategoryList(response.data);          
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
    
  }, []);

  const handleFilterSearch = async (category) => {
    await getProductsByType(category);
  };

  const handleInput = (productName) => {
    setProductName(productName);
  }; 

  const handleShowSearchBar = async () => {
    if(showSearchBar){
      await setShowSearchBar(false)
      handleSearch()
    } else{
      await setShowSearchBar(true);

    }
    
  };

  
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/searchByName?`,
        {
          params: {
            productName: productName.toUpperCase(),
            // startDate: startDate,
            // endDate: endDate || null,
            currentPage,
          },
        }
      );
      if (response) {
        debugger
        // setBanderaReservas(false);
        console.log('Productos segun busqueda', response.data);
        
        setPaginatedData(response.data);
        // setSearchResults([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
      // Manejar el error en tu aplicación, posiblemente mostrar un mensaje al usuario
    }
  };

  return (
      <VStack 
      shadow={'md'}  
      bg={"blanco"}
      justify={"space-between"}
      top={0}
      w={"100vw"}
      h={"100%"}
      >
        <HStack
          bg={"blanco"}
          pl={2}
          pr={10}
          py={5}
          justify={"space-between"}
          position={"fixed"}
          top={0}
          /* minW={400} */
          w={"100vw"}
          h={"100px"}
          zIndex={1000}
          flexWrap={wrap}
        >
          
                
          
          
          {media ? (
            // username ? (
            //   <HStack>
            //    <a
            //     href="/"
            //     style={{
            //       textDecoration: "none",
            //       color: "black",
            //     }}            
            //   >
                  
            //     <HStack display={'flex'} alignItems={'center'} justifyContent={'center'}>
            //     <Image
            //         src="../Isotipo-Valkiria-Sand.png"
            //         alt="Logo Valkiria"
            //       style={{
            //         height: "40px",
            //       }}
            //     />

            //     <Text fontFamily={'Prociono'}  color={'color'} fontWeight={"bold"} fontSize={'30px'}>VALKIRIA</Text>
            //     </HStack>
            //   </a>
            //   </HStack>          
            // ) :      
              
            <HStack display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <a
                href="/"
                style={{
                  textDecoration: "none",
                  color: "color",
                }}            
              >
                  
                <HStack display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Image
                    src="../Isotipo-Valkiria-Sand.png"
                    alt="Logo Valkiria"
                  style={{
                    height: "40px",
                  }}
                />

                <Text fontFamily={'Prociono'}  color={'color'} fontWeight={"bold"} fontSize={'30px'}>VALKIRIA</Text>
                </HStack>
              </a>
            </HStack>             
                  
            ) :       
            (
              <>
              <div style={{flex:'1'}}>         
                  <Menu>
                    <MenuButton
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
                      <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">CATEGORÍAS</Text>
                    </MenuButton>

                    <MenuList 
                      bg={"white"} borderColor={'gray.200'} >
                        {categoryList.map((category) => (

                      <MenuItem
                        bg={"white"}
                        as="a"
                        href="#"
                        onClick={() => handleFilterSearch(category.categoryName)}
                        key={category.id}
                      >
                        <Text fontFamily={"Roboto"} color="color" fontWeight="medium" fontSize="14px" _hover={{
                          cursor: "pointer", // Cambia el cursor al pasar por encima
                          fontWeight:'semibold',
                          textDecorationLine:'underline'
                          }}>{category.categoryName}</Text>
                        
                      </MenuItem>   

                              ))}
                      </MenuList>
                  </Menu>
                </div>
              <HStack style={{
                display: "flex",
                alignItems: "center",
                flex: '1',
                justifyContent:'center'
              }}>
                
                  <a
                  href="/"
                  style={{
                    textDecoration: "none",
                    color: "color",
                    
                  }}
                  >        
                <HStack display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <Image
                    src="../Isotipo-Valkiria-Sand.png"
                    alt="VALKIRIA"
                    style={{
                      height: "50px",
                    }}
                  />
                  <Text fontFamily={'Prociono'}  color={'color'} fontWeight={"bold"} fontSize={'40px'}>VALKIRIA</Text>
                  <Image
                    src="../Isotipo-Valkiria-2-Sand.png"
                    alt="VALKIRIA"
                    style={{
                      height: "50px",
                    }}
                  />
                </HStack>
                </a>
                
              </HStack> 
              </>
              )}

          {/**botones o nombre */}
          {media ? (
            username ? (
              <HStack spacing={0}>              
              <NavbarMenu username={username} roles={roles} />
              </HStack>
            ) : (
              <HStack spacing={0}>
                <div>      
                { showSearchBar &&
                <Input
                type="text"
                maxHeight={["20px","26px", "34px"]}
                maxWidth={["150px"]}
                focusBorderColor='color'
                bg={"blanco"}
                color="negro"
                value={productName}
                variant={'filled'}
                boxShadow={'md'}
                fontSize={[10,12,14]}
                placeholder="¿Qué buscás?"
                onChange={(e) => setProductName(e.target.value)}
                />
              }

                <Button
                onClick={() => handleShowSearchBar()}
                colorScheme={"whatsapp"}
                color={"color"}
                borderRadius={0}
                variant={"plain"}
                _hover={{
                  cursor: "pointer", // Cambia el cursor al pasar por encima
                  fontWeight:'bold',
                  borderBottom:'1px solid',
                  borderColor:' color'
                  }}
                >
                  <FaSearch />
                  {/* <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">INICIAR SESIÓN</Text> */}
                </Button>
              <Text color={'color'}>|</Text>   
                  <Menu>
                    <MenuButton
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
                      <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">MENU</Text>
                    </MenuButton>

                    <MenuList 
                      bg={"white"} border={'none'} >

                      
                        {/* <Text fontFamily={"Roboto"} color="color" fontWeight="medium" fontSize="10px" _hover={{
                          cursor: "pointer", // Cambia el cursor al pasar por encima
                          fontWeight:'semibold',
                          textDecorationLine:'underline'
                          }}>CATEGORÍAS</Text> */}
                          <Menu>
                            <MenuButton
                              color={"color"}
                              px={3}
                              // px={5}
                              borderRadius={0}
                              variant={"plain"}
                              _hover={{
                                cursor: "pointer", // Cambia el cursor al pasar por encima
                                fontWeight:'bold',
                                borderBottom:'1px solid',
                                borderColor:' color'
                                }}
                            >
                              <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="10px">CATEGORÍAS</Text>
                            </MenuButton>
                            <MenuList 
                              bg={"white"} border={'none'} >
                                {categoryList.map((category) => (
                              <MenuItem
                                bg={"white"}
                                as="a"
                                href="#"
                                onClick={() => handleFilterSearch(category.categoryName)}
                                key={category.id}
                              >
                                <Text fontFamily={"Roboto"} color="color" fontWeight="medium" fontSize="10px" _hover={{
                                  cursor: "pointer", // Cambia el cursor al pasar por encima
                                  fontWeight:'semibold',
                                  textDecorationLine:'underline'
                                  }}>{category.categoryName}</Text>
                                
                              </MenuItem>   
                                      ))}
                          
                            </MenuList >
                            {/* </MenuButton> */}
                          </Menu>                    
                      
                      <MenuItem
                        bg={"white"}
                        as="a"
                        href="#"
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        <Text fontFamily={"Roboto"} color="color" fontWeight="medium" fontSize="10px" _hover={{
                          cursor: "pointer", // Cambia el cursor al pasar por encima
                          fontWeight:'semibold',
                          textDecorationLine:'underline'
                          }}>INICIAR SESIÓN</Text>
                        
                      </MenuItem>

                      <MenuItem
                        bg={"white"}
                        as="a"
                        onClick={() => {
                          navigate("/register");
                        }}
                      >
                        <Text fontFamily={"Roboto"} color="color" fontWeight="medium" fontSize="10px" _hover={{
                          cursor: "pointer", // Cambia el cursor al pasar por encima
                          fontWeight:'semibold',
                          textDecorationLine:'underline'
                          }}>CREAR CUENTA</Text>
                      </MenuItem>
                    </MenuList>


                  </Menu>
                </div>
              </HStack>
                
            )) : username? (
              
              <HStack flex={1} justifyContent={'end'}>
                  { showSearchBar &&
                <Input
                type="text"
                maxHeight={["20px","26px", "34px"]}
                maxWidth={["150px"]}
                focusBorderColor='color'
                bg={"blanco"}
                color="negro"
                value={productName}
                variant={'filled'}
                boxShadow={'md'}
                fontSize={[10,12,14]}
                placeholder="¿Qué buscás?"
                onChange={(e) => setProductName(e.target.value)}
                />
              }

                <Button
                onClick={() => handleShowSearchBar()}
                colorScheme={"whatsapp"}
                color={"color"}
                borderRadius={0}
                variant={"plain"}
                _hover={{
                  cursor: "pointer", // Cambia el cursor al pasar por encima
                  fontWeight:'bold',
                  borderBottom:'1px solid',
                  borderColor:' color'
                  }}
                >
                  <FaSearch />
                  {/* <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">INICIAR SESIÓN</Text> */}
                </Button>
              <Text color={'color'}>|</Text>
                <Text mr={3} color={"color"} fontSize={14} fontWeight="medium" fontFamily={"Roboto"}>¡Hola {username}!</Text>
                <NavbarMenu username={username} roles={roles} />
              </HStack>
            ) : (
              <HStack spacing={0} flex={1} justifyContent={'end'}>
                { showSearchBar &&
                <Input
                type="text"
                maxHeight={["20px","26px", "34px"]}
                maxWidth={["150px"]}
                focusBorderColor='color'
                bg={"blanco"}
                color="negro"
                value={productName}
                variant={'filled'}
                boxShadow={'md'}
                fontSize={[10,12,14]}
                placeholder="¿Qué buscás?"
                onChange={(e) => setProductName(e.target.value)}
                />
              }

                <Button
                onClick={() => handleShowSearchBar()}
                colorScheme={"whatsapp"}
                color={"color"}
                borderRadius={0}
                variant={"plain"}
                _hover={{
                  cursor: "pointer", // Cambia el cursor al pasar por encima
                  fontWeight:'bold',
                  borderBottom:'1px solid',
                  borderColor:' color'
                  }}
                >
                  <FaSearch />
                  {/* <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">INICIAR SESIÓN</Text> */}
                </Button>
              <Text color={'color'}>|</Text>

                <Button
                onClick={() => {
                  navigate("/login");
                }}
                colorScheme={"whatsapp"}
                color={"color"}
                borderRadius={0}
                variant={"plain"}
                _hover={{
                  cursor: "pointer", // Cambia el cursor al pasar por encima
                  fontWeight:'bold',
                  borderBottom:'1px solid',
                  borderColor:' color'
                  }}
                >
                  <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">INICIAR SESIÓN</Text>
                </Button>
              <Text color={'color'}>|</Text>

                <Button
                onClick={() => {
                  navigate("/register");
                }}
                colorScheme={"whatsapp"}
                color={"color"}
                variant={"plain"}
                borderRadius={0}

                _hover={{
                  cursor: "pointer", // Cambia el cursor al pasar por encima
                  fontWeight:'bold',
                  borderBottom:'1px solid',
                  borderColor:' color'
                  }}
                >
                  <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">CREAR CUENTA</Text>
                </Button>  
            
              </HStack>
            )
            }
        </HStack>

        { (media && username) && 
          <HStack flexWrap={'wrap'}>
            <div style={{flex:'1'}}>         
              <Menu>
                <MenuButton
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
                  <Text fontFamily={"Roboto"} fontWeight="medium" fontSize="14px">CATEGORÍAS</Text>
                </MenuButton>

                <MenuList 
                  bg={"white"} borderColor={'gray.200'} >
                    {categoryList.map((category) => (

                  <MenuItem
                    bg={"white"}
                    as="a"
                    href="#"
                    onClick={() => handleFilterSearch(category.categoryName)}
                    key={category.id}
                  >
                    <Text fontFamily={"Roboto"} color="color" fontWeight="medium" fontSize="14px" _hover={{
                      cursor: "pointer", // Cambia el cursor al pasar por encima
                      fontWeight:'semibold',
                      textDecorationLine:'underline'
                      }}>{category.categoryName}</Text>
                    
                  </MenuItem>   

                  ))}
                </MenuList>
              </Menu>
            </div>

                <HStack style={{flex:'1'}}>            
                  <Input
                  type="text"
                  maxHeight={["20px","26px", "34px"]}
                  minWidth={["200px"]}
                  focusBorderColor='color'
                  bg={"blanco"}
                  color="negro"
                  value={productName}
                  variant={'filled'}
                  boxShadow={'md'}
                  fontSize={[10,12,14]}
                  placeholder="¿Qué buscás?"
                  onChange={(e) => setProductName(e.target.value)}
                  />

                  <Button
                  onClick={() => handleSearch()}
                  colorScheme={"whatsapp"}
                  color={"color"}
                  borderRadius={0}
                  variant={"plain"}
                  _hover={{
                    cursor: "pointer", // Cambia el cursor al pasar por encima
                    fontWeight:'bold',
                    borderBottom:'1px solid',
                    borderColor:' color'
                    }}
                  >
                    <FaSearch />
                  </Button>
                </HStack>
          
          </HStack>
        }
    </VStack>
  );
};

export default Navbar;