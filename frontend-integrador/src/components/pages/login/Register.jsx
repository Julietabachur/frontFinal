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
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const REGISTER_URL = "http://localhost:8080/auth/register";

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
      ? "El nombre de usuario puede contener letras, numeros y guión bajo, mínimo 5 y no tener espacios al inicio."
      : "";
  };

  const validateEmail = (email) => {
    return !emailRegex.test(email)
      ? "Formato de correo electrónico no válido."
      : "";
  };

  const validatePassword = (password) => {
    return !passwordRegex.test(password)
      ? "La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial."
      : "";
  };

  //Funciones para el manejo de errores en dependencia de las validaciones

  const handleFirstNameBlur = (firstName) => {
    setFirstName(firstName);
    setFirstNameError(validateName(firstName));
  };

  const handleLastNameBlur = (lastName) => {
    setLastName(lastName);
    setLastNameError(validateLastName(lastName));
  };

  const handleClientNameBlur = (clientName) => {
    setClientName(clientName);
    setClientNameError(validateClientName(clientName));
  };

  const handleEmailBlur = (email) => {
    setEmail(email);
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordError(
      password !== confirmPassword ? "Las contraseñas no coinciden." : ""
    );
  };

  //confirma si riskkojkt existe es que la pesona ya esta registrado y si no va a home
  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  const GETME_URL = import.meta.env.VITE_GETME_URL;

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

  //función para revisar si el clientName existe en el BE
  const CheckClientNameAndEmail = async (value, endpoint) => {
    endpoint === "clientName" &&
      (setIsNameLoading(true), handleClientNameBlur(value));

    endpoint === "email" &&
     (setIsEmailLoading(true), handleEmailBlur(value));

    if (value != undefined) {
      const response = await axios.get(
        `http://localhost:8080/auth/${endpoint}?${endpoint}=${value}`
      );
      if (response) {
        endpoint === "clientName" && setIsNameLoading(false);
        endpoint === "email" && setIsEmailLoading(false);

        if (response.data && endpoint === "clientName") {
          setShowClientNameDuplicatedError(false);
          setClientName(value);
        } else if (response.data && endpoint === "email") {
          setShowEmailDuplicatedError(false);
          setEmail(value);
        } else if (!response.data) {
          endpoint === "clientName" && setShowClientNameDuplicatedError(true);
          endpoint === "email" && setShowEmailDuplicatedError(true);
        }
      }
    }
  };

  //version demorada de del metodo checkName
  const debouncedCheckClientNameAndEmail = debounce(CheckClientNameAndEmail, 2000);

  //función para el Register similiar al onSubmit

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar campos antes de continuar
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
      clientName ||
      emailError ||
      passwordError ||
      confirmPasswordError
    ) {
      //esto es para mostrar en consola el error en que campo es
      if (firstNameError) console.error(`- Nombre: ${firstNameError}`);
      if (lastNameError) console.error(`- Apellido: ${lastNameError}`);
      if (clientNameError)
        console.error(`- Nombre de cliente: ${clientNameError}`);
      if (emailError) console.error(`- Email: ${emailError}`);
      if (passwordError) console.error(`- Contraseña: ${passwordError}`);
      if (confirmPasswordError)
        console.error(`- Confirmación de contraseña: ${confirmPasswordError}`);
      // Evitar que el formulario se envíe
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
          navigate("/");
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
              onChange={(e) => handleFirstNameBlur(e.target.value)}
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
              onChange={(e) => setLastName(e.target.value)}
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
                El Email ingresado ya está en uso. Por favor, elige otro.
              </div>
            )}
          </Box>

          <div>
            <input
              placeholder="password"
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <Button w="500px" colorScheme="green" onClick={handleRegister}>
            Registrarse
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
