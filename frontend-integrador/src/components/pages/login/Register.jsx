import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  Flex,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const nameRegex = /^[a-zA-Z][a-zA-Z_-]{2,22}$/;
const clientNameRegex = /^[a-zA-Z0-9_]{5,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const GETME_URL = import.meta.env.VITE_GETME_URL;
const baseUrl = import.meta.env.VITE_SERVER_URL;
const REGISTER_URL = import.meta.env.VITE_AUTH_URL + "/register";

const Register = () => {
  //constantes del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientNameValid, setClientNameValid] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  //constantes para manejo de errores en las validaciones
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [clientNameError, setClientNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  //constantes para manejo de errores cdo se valida duplicado en BE de clientName y email
  const [showClientNameDuplicatedError, setShowClientNameDuplicatedError] =
    useState(false);
  const [showEmailDuplicatedError, setShowEmailDuplicatedError] =
    useState(false);

  const navigate = useNavigate();

  //metodo que atrasa la ejecucion de la funcion una medida de tiempo 'delay'
  function debounce(func, delay) {
    let timer;
    // Acá esta cargando todos los argumentos de la función que voy a demorar CheckClientNameAndEmail
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  //Funciones de cada validación
  const validateName = (name) => {
    return !nameRegex.test(name)
      ? "El nombre debe contener solo letras, mínimo 4 y no tener espacios al inicio."
      : "";
  };

  const validateLastName = (lastName) => {
    return !nameRegex.test(lastName)
      ? "El apellido debe contener solo letras, mínimo 4 y no tener espacios al inicio."
      : "";
  };

  const validateClientName = (clientName) => {
    return !clientNameRegex.test(clientName)
      ? "El nombre de usuario puede contener letras, números y guión bajo, mínimo 5 y no tener espacios al inicio."
      : "";
  };

  const validateEmail = (email) => {
    return !emailRegex.test(email)
      ? "Formato de correo electrónico no válido."
      : "";
  };

  const validatePassword = (password) => {
    return !passwordRegex.test(password)
      ? "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial."
      : "";
  };

  //Funciones para el manejo de errores en dependencia de las validaciones

  const handleFirstNameChange = (firstName) => {
    setFirstName(firstName);
    setFirstNameError(validateName(firstName));
  };

  const handleLastNameChange = (lastName) => {
    setLastName(lastName);
    setLastNameError(validateLastName(lastName));
  };

  const handleClientNameChange = (clientName) => {
    setClientName(clientName);
    setClientNameError(validateClientName(clientName));
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    setEmailError(validateEmail(email));
  };
 
  const handlePasswordChange = (password) => {
    setPassword(password);
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordChange = (confirmPassword) => {
    setConfirmPassword(confirmPassword);
    setConfirmPasswordError(
      password !== confirmPassword ? "Las contraseñas no coinciden." : ""
    );
  };

  //confirma si riskkojkt existe es que la pesona ya esta registrado y si no va a home
  const token = JSON.parse(localStorage.getItem("riskkojwt"));



  const getUsername = async (token) => {
    try {
      const response = await axios.get(GETME_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        navigate("/");
      } else {
        localStorage.removeItem("riskkojwt");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUsername(token);
    }
  }, [token]);

  // Función para revisar si el clientName o el email existe en el Backend (BE)
const CheckClientNameAndEmail = async (value, endpoint) => {
  if (endpoint === "clientName") {
    // Activar la bandera de carga y manejar el cambio en el nombre del cliente
    //setIsNameLoading(true);
    handleClientNameChange(value);
  }
  else if (endpoint === "email") {
    // Activar la bandera de carga y manejar el cambio en la dirección de correo electrónico del cliente
    //setIsEmailLoading(true);
    handleEmailChange(value);
  }

  // Verificar si el valor no es undefined
  if (value !== undefined) {
    // Realizar una solicitud GET a la API con el valor del endpoint y el valor proporcionado
    const response = await axios.get(
      `${baseUrl}/auth/${endpoint}?${endpoint}=${value}`
    );

    // Verificar si hay una respuesta del servidor
    if (response) {
      // Desactivar las banderas de carga basándose en el endpoint
      if (endpoint === "clientName") {
        //setIsNameLoading(false);
      } else if (endpoint === "email") {
        //setIsEmailLoading(false);
      }

      // Si el nombre no existe en la BD la response sería True y el endpoint es "clientName"
      if (response.data && endpoint === "clientName") {
        // Ocultar el error de nombre duplicado y establecer el nombre del cliente
        setShowClientNameDuplicatedError(false);
        setClientName(value);
      }
      // Si el email no existe en la BD la response sería True y el endpoint es "email"
      else if (response.data && endpoint === "email") {
        // Ocultar el error de correo electrónico duplicado y establecer la dirección de correo electrónico del cliente
        setShowEmailDuplicatedError(false);
        setEmail(value);
      }
      // Si existe el ClientName o el email existen la BD entonce la response es false
      else if (!response.data) {
        // Mostrar el error de nombre o correo electrónico duplicado basándose en el endpoint
        if (endpoint === "clientName") {
          setShowClientNameDuplicatedError(true);
        } else if (endpoint === "email") {
          setShowEmailDuplicatedError(true);
        }
      }
    }
  }
};


  //version demorada de del metodo checkName
  const debouncedCheckClientNameAndEmail = debounce(CheckClientNameAndEmail, 2000);

  //función para el Register similiar al onSubmit

  const handleRegister = async (e) => {
    e.preventDefault();

    //Validar campos antes de continuar
    setFirstNameError(validateName(firstName));
    setLastNameError(validateLastName(lastName));
    setClientNameError(validateClientName(clientName));
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));
    setConfirmPasswordError(
      password !== confirmPassword ? "Las contraseñas no coinciden." : ""
    );

    if (
      firstNameError ||
      lastNameError ||
      clientNameError ||
      emailError ||
      passwordError ||
      confirmPasswordError
    ) {
      // Evitar que el formulario se envíe*/
      return;
    }

    try {
      // Lógica para enviar el formulario
      const response = await axios.post(REGISTER_URL, {
        firstName,
        lastName,
        clientName,
        email,
        password,
      });

      if (response.status === 200) {
        console.log(response.data);
        localStorage.setItem("riskkojwt", JSON.stringify(response.data.token));
        window.alert(
          "Registro exitoso. Serás redirigido a la página de inicio."
        );
        setTimeout(() => {
          const targetUrl = "/verifyReg?mailToken=" + response.data.verifyToken ;
          navigate(targetUrl);
          window.location.reload();
        }, 1000);
      } else {
        alert("Fallo el registro, recargue la página y pruebe nuevamente");
      }
    } catch (error) {
      // Manejar errores de la solicitud
      console.error("Error en el registro:", error);
    }
  };

  //estilos compartidos por todos los inputs
  const inputStyle = {
    padding: "6px",
    width: "500px",
    borderRadius: "5px",
    border: "0.5px solid lightgray",
    color: "gray",
    marginBottom: "10px",
    autoComplete: "off",
    paddingLeft: "15px",
  };

  const errorStyle = {
    height: "50px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
      <Box pos={"relative"} top={100} w={"97vw"} h={"100vh"}>
        <form
          onSubmit={handleRegister}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <input
              placeholder="Nombre"
              style={inputStyle}
              type="text"
              value={firstName}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          {firstNameError && (
            <div style={errorStyle}>
              <div style={{ color: "red", fontSize: "16px" }}>
                {firstNameError}
              </div>
            </div>
          )}

          <div>
            <input
              placeholder="Apellido"
              type="text"
              style={inputStyle}
              value={lastName}
              onChange={(e) => handleLastNameChange(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          {lastNameError && (
            <div style={errorStyle}>
              <div style={{ color: "red", fontSize: "16px" }}>
                {lastNameError}
              </div>
            </div>
          )}

          <Box position={"relative"}>
            <input
              placeholder="Nombre de usuario"
              type="text"
              style={inputStyle}
              onChange={(e) =>
                debouncedCheckClientNameAndEmail(e.target.value, "clientName")
              }
              required
              autoComplete="off"
            />
            {isNameLoading && (
              <Box
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  zIndex: "10",
                }}
              >
                <Spinner color="red.500" />
              </Box>
            )}
          </Box>
          <Box>
            {clientNameError && (
              <div style={errorStyle}>
                <div style={{ color: "red", fontSize: "16px" }}>
                  {clientNameError}
                </div>
              </div>
            )}
          </Box>
          <Box>
            {showClientNameDuplicatedError && (
              <div style={{ color: "red", fontSize: "16px" }}>
                El nombre de usuario ya está en uso. Por favor, elige otro.
              </div>
            )}
          </Box>

          <Box>
            <input
              placeholder="Email"
              style={inputStyle}
              type="email"
              onChange={(e) =>
                debouncedCheckClientNameAndEmail(e.target.value, "email")
              }
              required
              autoComplete="off"
            />
            {isEmailLoading && (
              <Box
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  zIndex: "10",
                }}
              >
                <Spinner color="red.500" />
              </Box>
            )}
          </Box>
          <Box>
            {emailError && (
              <div style={errorStyle}>
                <div style={{ color: "red", fontSize: "16px" }}>
                  {emailError}
                </div>
              </div>
            )}
          </Box>
          <Box>
            {showEmailDuplicatedError && (
              <div style={{ color: "red", fontSize: "16px" }}>
                El e-mail ingresado ya está en uso. Por favor, elige otro.
              </div>
            )}
          </Box>

          <div>
            <input
              placeholder="password"
              style={inputStyle}
              type="password"
              value={password}
              //onChange={(e) => setPassword(e.target.value)}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          {passwordError && (
            <div style={errorStyle}>
              <div style={{ color: "red", fontSize: "16px" }}>
                {passwordError}
              </div>
            </div>
          )}
          <div>
            <input
              placeholder="Confirm Password"
              style={inputStyle}
              type="password"
              value={confirmPassword}
              //onChange={(e) => setConfirmPassword(e.target.value)}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          {confirmPasswordError && (
            <div style={errorStyle}>
              <div style={{ color: "red", fontSize: "16px" }}>
                {confirmPasswordError}
              </div>
            </div>
          )}

          <Button w="500px" backgroundColor={"verde2"} onClick={handleRegister}>
            Registrarse
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
