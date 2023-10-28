import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import LoginPage from "./components/pages/login/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./components/pages/adminPanel/AdminDashboard";
import { HStack, Box } from "@chakra-ui/react";
import DetailPage from "./components/pages/DetailPage";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function App() {
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const [username, setUsername] = useState("");
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
          <Navbar username={username? username : null} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/detalle/:id" element={<DetailPage />} />
          </Routes>
          <Footer />
        </Router>
      </Box>
    </HStack>
  );
}

export default App;
