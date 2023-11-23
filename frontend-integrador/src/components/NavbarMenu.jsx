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
  const [admin, setAdmin] = useState(false);
  const { favorites, getFavorites } = useProductContext();
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.removeItem("riskkojwt");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if (roles.some((role) => role == "ADMIN")) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, []);

  return (
    <Menu>
      <MenuButton as={Box}>
        <Avatar name={username} />
      </MenuButton>
      <MenuList>
        <MenuItem
          as={Button}
          onClick={() => {
            navigate(`/perfil`);
          }}
        >
          Mi perfil
        </MenuItem>
        {admin && (
          <MenuItem
            as={Button}
            onClick={() => {
              navigate(`/admin`);
            }}
          >
            Panel administrador
          </MenuItem>
        )}
        <MenuItem
        as={Button}
        colorScheme="green"
        variant={"ghost"}
        onClick={() => getFavorites()}
        >Mis reservas </MenuItem>
        <MenuItem
          as={Button}
          colorScheme="green"
          variant={"ghost"}
          onClick={() => getFavorites()}
        >
          Mis Favoritos{" "}
        </MenuItem>

        <MenuItem
          as={Button}
          colorScheme="red"
          variant={"ghost"}
          onClick={logoutHandle}
        >
          Salir
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavbarMenu;
