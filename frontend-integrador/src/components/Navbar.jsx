import React from "react";
import { Button, HStack,VStack,Image } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <HStack
    bg={'#000'}
    p={10}
    justify={'space-between'}
    position={"fixed"}
    top={0}
    w={'100vw'}
    zIndex={1000}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <a
          href="/home"
          style={{
            textDecoration: "none",
            color: "white",
            marginRight: "20px",
          }}
        >
          <Image
            src="https://images-g3.s3.amazonaws.com/RISKKO-Logo-Wh.png"
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
      <HStack>
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
      </HStack>
    </HStack>
  );
};

export default Navbar;
