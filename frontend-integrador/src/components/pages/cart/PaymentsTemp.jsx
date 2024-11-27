import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentsTemps.css";
import { Text, useToast } from "@chakra-ui/react";

function PaymentsTemp() {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
    errors: {}, // Para manejar los errores de validación
  });

  const toast = useToast();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "number":
        if (!/^\d{16}$/.test(value)) {
          error = "El número de la tarjeta debe tener exactamente 16 dígitos.";
        }
        break;
      case "name":
        if (!/^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s?){1,3}$/.test(value)) {
          error = "El nombre debe contener entre 1 y 3 nombres separados por espacios.";
        }
        break;
      case "expiry":
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
          error = "La fecha debe estar en formato MM/YY.";
        } else {
          const [month, year] = value.split("/").map(Number);
          const currentYear = new Date().getFullYear() % 100; // Últimos 2 dígitos del año actual
          const currentMonth = new Date().getMonth() + 1;

          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            error = "La fecha de expiración debe ser superior a la fecha actual.";
          }
        }
        break;
      case "cvc":
        if (!/^\d{3}$/.test(value)) {
          error = "El CVV debe contener exactamente 3 dígitos.";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handleInputBlur = (evt) => {
    const { name, value } = evt.target;
    const error = validateField(name, value);

    if (error) {
      toast({
        title: "Error en el campo",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  };

  return (
    <div className="page-payments-container">
      <div className="form-container">
        {/* <h2 className="title-payments">Datos del pago</h2> */}
        <Text mb={4} fontWeight="medium" fontFamily={"Roboto"} textAlign={'center'} fontSize={{base:'lg',md:"2xl"}} color={'#e1bc6a'} mt={'20px'}>
        Datos del pago
                </Text>
        <Cards
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />
        <form className="form-payments">
          <label htmlFor="serialCardNumber" className="label">
            <span className="title">Número de tarjeta</span>
            <input
              id="serialCardNumber"
              className="input-field"
              type="number"
              name="number"
              placeholder="0000 0000 0000 0000"
              value={state.number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </label>
          <label htmlFor="name" className="label">
            <span className="title">Nombre completo</span>
            <input
              className="input-field"
              type="text"
              name="name"
              placeholder="Nombre como figura en la tarjeta"
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </label>
          <div className="split">
            <label htmlFor="ExDate" className="label">
              <span className="title">Fecha expiración</span>
              <input
                id="ExDate"
                className="input-field"
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>
            <label htmlFor="cvv" className="label">
              <span className="title"> CVV</span>
              <input
                id="cvv"
                className="input-field"
                type="number"
                name="cvc"
                placeholder="CVV"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentsTemp;
