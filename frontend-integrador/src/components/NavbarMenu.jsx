import {
  Menu,
  MenuButton,
  Box,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Avatar,
  Button,
  Link,
  border,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductContext} from "./pages/home/Global.context";

const NavbarMenu = ({ username, token, roles }) => {
  const [admin, setAdmin] = useState(false);
  const { favorites, getFavorites, setBanderaReservas, carrito, setSeason} = useProductContext();
  const navigate = useNavigate();
  const toast = useToast(); 
  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    setSeason('Primavera')
    navigate("/");
    window.location.reload();
  };

  const handleFavorites = () => {
    getFavorites()
    navigate('/')
    
  };

  const handleReserves = () => {
    setBanderaReservas(true);
    navigate('/reserve')
    
  };

  useEffect(() => {
    if (roles.some((role) => role == "ADMIN")) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, []);
  const handleCart = () => {
    if (carrito?.products?.length === 0) {
      // Si el carrito está vacío, mostramos el toast
      toast({
        title: "Carrito vacío",
        description: "No tienes productos agregados al carrito.",
        status: "warning",
        duration: 4000, 
        isClosable: true, 
        position: "top-right",
      });
    } else {
      // Si hay productos, navegamos al carrito
      navigate("/checkout/cart");
    }
  };

  return (
    <Menu  >
      <MenuButton as={Box}>
        <Avatar
          bg={"gray.100"}
          size="md"
          color={"color"}
          fontWeight={"black"}
          name={username}
        />
      </MenuButton>
      <MenuList bg={'white'} borderColor={'gray.200'}>
        <MenuItem
          color={'color'} 
          borderRadius={'0'} 
          bg={'white'}
          _hover={{
            cursor: "pointer", // Cambia el cursor al pasar por encima
            fontWeight:'semibold',
            textDecorationLine:'underline'
            }}
          onClick={() => {
            navigate(`/perfil`);
          }}
        >
          Mi Perfil
        </MenuItem>
        {admin && (
          <MenuItem
          color={'color'} 
          borderRadius={'0'} 
          bg={'white'}
          _hover={{
            cursor: "pointer", // Cambia el cursor al pasar por encima
            fontWeight:'semibold',
            textDecorationLine:'underline'
            }}
            onClick={() => {
              navigate(`/admin`);
            }}
          >
            Panel administrador
          </MenuItem>
        )}
        <MenuItem
       color={'color'} 
       borderRadius={'0'} 
       bg={'white'}
       _hover={{
        cursor: "pointer", // Cambia el cursor al pasar por encima
        fontWeight:'semibold',
        textDecorationLine:'underline'
        }}
          onClick={handleCart}
          //onClick={() => navigate('/checkout/cart')}
        >
          Mi Carrito ({carrito?.products?.length || 0})
        </MenuItem>
        <MenuItem
         color={'color'} 
         borderRadius={'0'} 
         bg={'white'}
         _hover={{
          cursor: "pointer", // Cambia el cursor al pasar por encima
          fontWeight:'semibold',
          textDecorationLine:'underline'
          }}
          onClick={() => handleFavorites()}
        >
          Mis Favoritos ({favorites.length})
        </MenuItem>

        <MenuItem
        //  as={Button}
         bg={"white"}
        //  variant={"ghost"}
         onClick={logoutHandle}
         color={'color'}
         borderRadius={'0'}
         _hover={{
          cursor: "pointer", // Cambia el cursor al pasar por encima
          fontWeight:'semibold',
          textDecorationLine:'underline'
          }}
        >
          Salir
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavbarMenu;
