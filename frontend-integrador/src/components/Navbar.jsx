<<<<<<< Updated upstream
import React from "react";
import { Button } from "@chakra-ui/react";
=======
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "./NavbarMenu";

const Navbar = ({ username, setUserName, roles }) => {
  const [media, setMedia] = useState(false);
  const navigate = useNavigate();
  const GETME_URL = import.meta.env.VITE_GETME_URL;
  const MIN_DESKTOP_WIDTH = 768;

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
>>>>>>> Stashed changes

const Navbar = () => {
  return (
    <header
      style={{
        width: "100%",
        height: "100px",
        position: "fixed",
        top: 0,
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "white",
            marginRight: "20px",
          }}
        >
          <img
            src="/HOME"
            alt="Logo"
            style={{
              height: "30px",
            }}
          />
        </a>
        <span
          style={{
            color: "white",
          }}
        >
          Lema de la Empresa
        </span>
      </div>
<<<<<<< Updated upstream
      <div>
        <Button
          style={{
            marginRight: "10px",
          }}
          colorScheme="whatsapp"
          borderRadius={20}
          variant={"outline"}
        >
          Iniciar sesión
        </Button>
        <Button colorScheme="whatsapp" variant={"outline"} borderRadius={20}>
          Crear cuenta
        </Button>
      </div>
    </header>
=======
      {/**botones o nombre */}
      {media ? (
        username ? (
          <NavbarMenu username={username} roles={roles} />
        ) : (
          <Menu>
            <MenuButton
              color={"verde2"}
              p={3}
              pl={5}
              pr={5}
              borderRadius={25}
              border={"1px solid green"}
            >
              Ingresar
            </MenuButton>

            <MenuList bg={"negro"}>
              <MenuItem
                bg={"negro"}
                as="a"
                href="#"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <Text color={"verde2"}>Iniciar sesión</Text>
              </MenuItem>
              <MenuItem
                bg={"negro"}
                as="a"
                onClick={() => {
                  navigate("/register");
                }}
              >
                <Text color={"verde2"}>Crear cuenta</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        )
      ) : username ? (
        <HStack>
          <Text mr={3} color={"verde2"} fontSize={20} fontFamily={"saira"}>
            {username}
          </Text>
          <NavbarMenu username={username} roles={roles} />
        </HStack>
      ) : (
        <HStack>
          <Button
            onClick={() => {
              navigate("/login");
            }}
            style={{
              marginRight: "10px",
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={20}
            variant={"outline"}
          >
            Iniciar sesión
          </Button>
          <Button
            onClick={() => {
              navigate("/register");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            variant={"outline"}
            borderRadius={20}
          >
            Crear cuenta
          </Button>
        </HStack>
      )}
    </HStack>
>>>>>>> Stashed changes
  );
};

export default Navbar;
