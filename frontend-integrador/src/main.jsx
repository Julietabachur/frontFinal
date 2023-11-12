import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { ProductProvider } from "./components/pages/home/Global.context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ProductProvider>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </ProductProvider>
);
