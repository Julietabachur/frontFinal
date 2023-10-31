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

const NavbarMenu = ({ username, token, roles }) => {
 const [admin,setAdmin] =useState(false)
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    navigate("/");
    window.location.reload();
  };

  useEffect(()=> {
    if(roles.some(role => role.authority == 'ROLE_ADMIN')){
      console.log('yes');
      setAdmin(true)
    }else{
      console.log('no');
      setAdmin(false)
    }
  },[])

  return (
    <Menu>
      <MenuButton as={Box}>
        <Avatar name={username} />
      </MenuButton>
      <MenuList>
        <MenuGroup title="Perfil">
          <MenuItem as={Button} onClick={()=>{navigate(`/perfil`)}} >
            Mi perfil
          </MenuItem>
          {admin && <MenuItem as={Button} onClick={()=>{navigate(`/admin`)}} >
            Panel administrador
          </MenuItem>}
          <MenuItem>Mis reservas </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Ayuda">
          <MenuItem>Docs</MenuItem>
          <MenuItem>FAQ</MenuItem>
          <MenuItem
            as={Button}
            colorScheme="red"
            variant={"ghost"}
            onClick={logoutHandle}
          >
            Salir
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default NavbarMenu;
