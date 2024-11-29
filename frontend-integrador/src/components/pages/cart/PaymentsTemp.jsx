import React, { useState, useEffect } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentsTemps.css";
import { Text, useToast } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom"; // Asegúrate de importar useOutletContext
import { useProductContext } from '../home/Global.context';
function PaymentsTemp() {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
    errors: {}, // Para manejar los errores de validación
  });

  const { setChildValidationFunc, setValid } = useOutletContext(); // Obtén las funciones del contexto
  const toast = useToast();
  const { carrito, setSale, saveSale, sale } = useProductContext()
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  // Función de validación de campos
  const validateField = (name, value) => {
    let error = "";

    // if (!value) {
    //   return `${name} es obligatorio.`;
    // }

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
  //taast
  // Maneja los cambios en los campos de entrada
  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja el enfoque en los campos de entrada
  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  // Maneja la pérdida de enfoque y valida el campo
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

  // const newSale = {
  //   productList: sale.products,
  //   idUser: sale.idUser,
  //   totalPrice: sale.totalPrice,
  //   saleDate: sale.saleDate,
  //   entrega: sale.entrega,
  //   domicilio: sale.domicilio, // Concatenación de datos
  //   medioDePago: `Tarjeta número: ${state.number}, Titular: ${state.name}` // Concatenación de datos
  // };

 
    

  const validateAllFields = () => {
    let isValid = true;
    let errors = {};
  
    // Validamos todos los campos
    for (let field in state) {
      if (field !== 'focus' && field !== 'errors') {
        const error = validateField(field, state[field]);
        if (error) {
          isValid = false;
          errors[field] = error; // Guardamos el error
        }
      }
    }
  
    // Actualizamos los errores
    setState(prevState => ({
      ...prevState,
      errors: errors
    }));
  
    // // Si el formulario no es válido, mostramos el toast de "Completa todos los campos"
    // if (!isValid) {
    //   toast({
    //     title: "Formulario incompleto",
    //     description: "Completa todos los campos",
    //     status: "error",
    //     duration: 3000,
    //     isClosable: true,
    //   });
    // }
  
    if (!isValid) {
      toast({
        title: "Formulario incompleto",
        description: "Completa todos los campos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const newSale = {
      productList: sale.productList,
      idUser: sale.idUser,
      entrega: sale.entrega,
      domicilio: sale.domicilio, // Concatenación de datos
      medioDePago: `Titular: ${state.name}, tarjeta número: ${state.number} `,
      totalPrice: sale.totalPrice,
      saleDate: sale.saleDate, 
    };
    // Si el formulario es válido, actualizamos la venta
  // setSale((prevSale) => {
  //   const updatedSale = {
  //     ...prevSale,
  //     medioDePago: `Tarjeta número: ${state.number}, Titular: ${state.name}`,
  //   };

  //   // Aquí puedes llamar a handleSaleSave después de que sale se actualice
  //   handleSaleSave(updatedSale);  // Le pasamos el nuevo objeto 'updatedSale'

  //   return updatedSale;  // Retornamos el objeto actualizado
  // });

    setSale(newSale)
    //handleSaleSave()

    setIsReadyToSave(true); // Marcamos que la venta está lista para guardarse
    return true;
  };

  // Se ejecuta cuando `sale` cambia y está listo para guardarse
  useEffect(() => {
    if (isReadyToSave) {
      handleSaleSave();
      setIsReadyToSave(false); // Reiniciamos el estado para evitar ejecuciones repetidas
    }
  }, [sale, isReadyToSave]);
  
  // Nueva función para guardar la venta
  const handleSaleSave = () => {
    // Verificamos que todos los campos necesarios estén presentes
    const isSaleReady = 
      sale.productList && sale.productList.length > 0 &&
      sale.idUser &&
      sale.entrega &&
      sale.medioDePago
    if (isSaleReady) {
      console.log("Intentando guardar venta:", sale);
      saveSale(sale);
    } else {
      toast({
        title: "Venta incompleta",
        description: "Faltan datos necesarios para completar la venta",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Pasamos la función de validación al componente padre usando setChildValidationFunc
  useEffect(() => {
    setChildValidationFunc(() => validateAllFields);
  }, [state, setChildValidationFunc]);

  return (
    <div className="page-payments-container">
      <div className="form-container">
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
            {state.errors.number && <p className="error">{state.errors.number}</p>}
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
            {state.errors.name && <p className="error">{state.errors.name}</p>}
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
              {state.errors.expiry && <p className="error">{state.errors.expiry}</p>}
            </label>
            <label htmlFor="cvv" className="label">
              <span className="title">CVV</span>
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
              {state.errors.cvc && <p className="error">{state.errors.cvc}</p>}
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentsTemp;
