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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NavbarMenu = ({ username, token }) => {
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    navigate("/");
    window.location.reload();
  };

  return (
    <Menu>
      <MenuButton as={Box}>
        <Avatar name={username} />
      </MenuButton>
      <MenuList>
        <MenuGroup title="Perfil">
          <MenuItem>Mi perfil</MenuItem>
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
