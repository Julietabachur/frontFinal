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
          color={"black"}
          fontWeight={"black"}
          name={username}
        />
      </MenuButton>
      <MenuList bg={'black'} borderColor={'verde2'}>
        <MenuItem
          color={'verde2'} 
          borderRadius={'0'} 
          bg={'black'}
          _hover={{ bgColor:'verde2', color:'black' }}
          onClick={() => {
            navigate(`/perfil`);
          }}
        >
          Mi perfil
        </MenuItem>
        {admin && (
          <MenuItem
          color={'verde2'} 
          borderRadius={'0'} 
          bg={'black'}
          _hover={{ bgColor:'verde2', color:'black' }}
            onClick={() => {
              navigate(`/admin`);
            }}
          >
            Panel administrador
          </MenuItem>
        )}
        <MenuItem
       color={'verde2'} 
       borderRadius={'0'} 
       bg={'black'}
       _hover={{ bgColor:'verde2', color:'black' }}
          onClick={() => handleReserves()}
        >
          Mis reservas{" "}
        </MenuItem>
        <MenuItem
         color={'verde2'} 
         borderRadius={'0'} 
         bg={'black'}
         _hover={{ bgColor:'verde2', color:'black' }}
          onClick={() => handleFavorites()}
        >
          Mis Favoritos{" "}
        </MenuItem>

        <MenuItem
        //  as={Button}
         bg={"black"}
        //  variant={"ghost"}
         onClick={logoutHandle}
         color={'verde2'}
         borderRadius={'0'}
         _hover={{ bgColor:'red', color:'black' }}

        >
          Salir
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavbarMenu;
