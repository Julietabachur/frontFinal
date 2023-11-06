
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
<<<<<<< Updated upstream
import LandingPage from "./components/pages/landing/LandingPage";
import LoginPage from "./components/pages/login/LoginPage";
=======
import Login from "./components/pages/login/Login";
import Register from "./components/pages/login/Register";
import Navbar from "./components/Navbar";
>>>>>>> Stashed changes
import Footer from "./components/Footer";
<<<<<<< Updated upstream
import Navbar from "./components/Navbar";
=======
import AdminDashboard from "./components/pages/adminPanel/adminDashboard";
import { HStack, Box } from "@chakra-ui/react";
<<<<<<< Updated upstream
import  Detail  from "./components/Detail/Detail";

>>>>>>> Stashed changes

function App() {

=======
import DetailPage from "./components/pages/DetailPage";
import { useState, useEffect } from "react";
import axios from "axios";
import Perfil from "./components/Perfil";

function App() {
  const token = JSON.parse(localStorage.getItem("riskkojwt"));

  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
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
        setUsername(response.data.username);
        setRoles(response.data.roles);
        console.log(response.data.roles);
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
>>>>>>> Stashed changes

  return (
<<<<<<< Updated upstream
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
      <Footer />
    </>
=======
    <HStack>
      <Box position={"relative"} top={"100px"}>
        <Router>
<<<<<<< Updated upstream
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/detail/:id" element={<Detail/>} />
            

=======
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
>>>>>>> Stashed changes
          </Routes>
          {<Footer />}
        </Router>
      </Box>
    </HStack>
>>>>>>> Stashed changes
  );
}

export default App;
