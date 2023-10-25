import React from "react";
import { Button, HStack, VStack, Image, theme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <HStack
      bg={"negro"}
      p={10}
      justify={"space-between"}
      position={"fixed"}
      top={0}
      w={"100vw"}
      h={"120px"}
      zIndex={1000}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image
            src="https://images-g3.s3.amazonaws.com/dibujoHeader.png"
            alt="Logo dibujo"
            style={{
              height: "60px",
            }}
            mr={3}
          />
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
        <span
          style={{
            color: "white",
          }}
        >
          Vestite con estilo
        </span>
      </div>
      <HStack>
        <Button
          onClick={()=>{navigate('/login')}}
          style={{
            marginRight: "10px",
          }}
          colorScheme={"whatsapp"} color={'verde2'}
          borderRadius={20}
          variant={"outline"}
        >
          Iniciar sesión
        </Button>
        <Button onClick={()=>{navigate('/register')}} colorScheme={"whatsapp"}  color={'verde2'}  variant={"outline"} borderRadius={20}>
          Crear cuenta
        </Button>
      </HStack>
    </HStack>
  );
};

export default Navbar;
