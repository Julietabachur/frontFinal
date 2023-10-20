import React from "react";
import { Button } from "@chakra-ui/react";

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
  );
};

export default Navbar;
