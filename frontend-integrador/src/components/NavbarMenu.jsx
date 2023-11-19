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
import { useProductContext } from "./pages/home/Global.context";

const NavbarMenu = ({ username, token, roles }) => {
  const { getFavoriteProducts, getProducts } = useProductContext();
 const [admin,setAdmin] =useState(false)
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    navigate("/");
    window.location.reload();
  };

  useEffect(()=> {
    if(roles.some(role => role == 'ADMIN')){
      setAdmin(true)
    }else{
      setAdmin(false)
    }
  },[])

  return (
    <Menu  >
      <MenuButton as={Box}>
        <Avatar name={username} />
      </MenuButton>
      <MenuList bg={'black'} px={2}>
        <MenuGroup >
          <MenuItem as={Button} 
          onClick={()=>{
            getProducts()
            navigate(`/`)}} 
          color={'verde2'} 
          colorScheme={"black"} 
          borderRadius={'0'} 
          bg='{black}'
          _hover={{ borderColor:'verde2' }}
          >
            Inicio
          </MenuItem>
          <MenuItem as={Button} 
          onClick={()=>{
            getFavoriteProducts()
            navigate(`/perfil`)
          }} 
          color={'verde2'} 
          colorScheme={"black"} 
          borderRadius={'0'} 
          bg='{black}'
          _hover={{ borderColor:'verde2' }}
          >
            Mi perfil
          </MenuItem>
          
          <MenuItem as={Button} 
          onClick={()=>{
            getFavoriteProducts()
            navigate(`/favorites`)
          }} 
          color={'verde2'} 
          colorScheme={"black"} 
          borderRadius={'0'} 
          bg='{black}'
          _hover={{ borderColor:'verde2' }}

          >
            Mis favoritos
          </MenuItem>          
          {admin && <MenuItem as={Button} 
          onClick={()=>{navigate(`/admin`)}} 
          color={'verde2'} 
          colorScheme={"black"} 
          borderRadius={'0'} 
          bg='{black}'
          _hover={{ borderColor:'verde2' }}
          >
            Panel administrador
          </MenuItem>}
          <MenuItem
            as={Button}
            bg={"verde2"}
            variant={"ghost"}
            onClick={logoutHandle}
            color={'black'}
            borderRadius={'0'}
            _hover={{ borderColor:'green', bgColor:'verde2' }}
          >
            Salir
          </MenuItem>
        </MenuGroup>      
      </MenuList>
    </Menu>
  );
};

export default NavbarMenu;
