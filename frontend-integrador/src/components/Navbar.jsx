import { useEffect, useState } from "react";
import {
  Button,
  HStack,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [media, setMedia] = useState(false);

  const navigate = useNavigate();
  const MIN_DESKTOP_WIDTH = 600;

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
      } else {
        setMedia(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <HStack
      bg={"negro"}
      p={10}
      justify={"space-between"}
      position={"fixed"}
      top={0}
      w={"100%"}
      h={"120px"}
      zIndex={1000}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {!media && (
          <Image
            src="https://images-g3.s3.amazonaws.com/dibujoHeader.png"
            alt="Logo dibujo"
            style={{
              height: "60px",
            }}
            mr={3}
          />
        )}
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "white",
            marginRight: "20px",
          }}
        >
          <Image
            src="https://images-g3.s3.amazonaws.com/logoHeader.png"
            alt="Logo"
            style={{
              height: "30px",
            }}
          />
        </a>
        {!media && (
          <span
            style={{
              color: "white",
            }}
          >
            Vestite con estilo
          </span>
        )}
      </div>
      {media && (
        <Menu>
          <MenuButton>
            <Button
              colorScheme={"whatsapp"}
              color={"verde2"}
              variant={"outline"}
              borderRadius={20}
            >
              Ingresar
            </Button>
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
              <Text color={"verde2"}>Loguearse</Text>
            </MenuItem>
            <MenuItem
              bg={"negro"}
              as="a"
              onClick={() => {
                navigate("/register");
              }}
            >
              <Text color={"verde2"}>Registrarse</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {!media && (
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
  );
};

export default Navbar;
