import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import CarritoPage from "./components/pages/carrito/CarritoPage";
import Login from "./components/pages/login/Login";
import Register from "./components/pages/login/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./components/pages/adminPanel/AdminDashboard";
import { HStack, Box } from "@chakra-ui/react";
import DetailPage from "./components/pages/DetailPage";
import { useState, useEffect } from "react";
import axios from "axios";
import Perfil from "./components/Perfil";
import { useProductContext } from "./components/pages/home/Global.context";
import ReservesPage from "./components/pages/reserves/ReservesPage";
import VerifyReg from "./components/pages/login/VerifyReg";
import Payments from "./components/pages/cart/PaymentsTemp";
import Shipping from "./components/pages/cart/Shipping";
import CartTest from "./components/pages/cart/CartTest";
import Succes from "./components/pages/cart/Succes";
import CheckoutStepper from "./components/pages/cart/Stepper";
import PerfilUser from "./components/PerfilUser";


function App() {
  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  const verifyToken = null;
  const mailToken = null;

  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const GETME_URL = import.meta.env.VITE_GETME_URL;
  const { setFavorites, setClientId, setToken } = useProductContext();

  const getUsername = async (token) => {
    try {
      const response = await axios.get(GETME_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        setUsername(response.data.username);
        setRoles(response.data.roles);
        setFavorites(response.data.favorites);
        setClientId(response.data.id);
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

  // const CheckoutLayout = () => {
  //   return (
  //     <Box>
  //       <CheckoutStepper />
  //       <Outlet /> {/* This renders the child routes */}
  //     </Box>
  //   );}

  return (
    <HStack>
      <Box position={"relative"} top={"100px"}>
        <Router>
          <Navbar
            roles={roles}
            username={username ? username : null}
            setUsername={setUsername}
          />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verifyReg" element={<VerifyReg />} />
            <Route path="/admin" element={<AdminDashboard token={token ? token : ""} roles={roles}/>} />
            <Route path="/carrito" element={<CarritoPage username={username} />} />
            <Route path="/detalle/:id" element={<DetailPage username={username} />} />   
            <Route path="/perfil" element={  <PerfilUser roles={roles} username={username} token={token ? token : ""}/> } />           
            <Route path="/checkout" element={<CheckoutStepper />}>
              <Route path="cart" element={<CartTest />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="payment" element={<Payments />} />
              <Route path="success" element={<Succes />} />
            </Route>
          </Routes>

          {<Footer />}
        </Router>
      </Box>
    </HStack>
  );
}

export default App;
