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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductContext} from "./pages/home/Global.context";

const NavbarMenu = ({ username, token, roles }) => {
  const [admin, setAdmin] = useState(false);
  const { favorites, getFavorites, setBanderaReservas} = useProductContext();
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    navigate("/");
    window.location.reload();
  };

  const handleFavorites = () => {
    setBanderaReservas(false);
    navigate('/')
    getFavorites()
    
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
          Mi perfil
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
          onClick={() => handleReserves()}
        >
          Mis reservas{" "}
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
          Mis Favoritos{" "}
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
