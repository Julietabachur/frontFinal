import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
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
import AdminFeatures from "./components/pages/adminPanel/AdminFeatures";
import NewProduct from "./components/pages/adminPanel/NewProduct";
import Favorites from "./components/Favorites";
import { useProductContext } from "./components/pages/home/Global.context";
import Verify from "./components/pages/login/Verify";


function App() {

  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const GETME_URL = import.meta.env.VITE_GETME_URL;
  const {setFavorites, setClientId, setToken} = useProductContext();

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
            <Route
              path="/admin"
              element={<AdminDashboard token={token ? token : ""} />}
            />
            <Route path="/detalle/:id" element={<DetailPage />} />
            <Route
              path="/perfil"
              element={
                <Perfil
                  roles={roles}
                  username={username}
                  token={token ? token : ""}
                />                
              }              
            />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
          {<Footer />}
        </Router>
      </Box>
    </HStack>
  );
}

export default App;
