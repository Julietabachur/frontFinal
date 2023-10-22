import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import LoginPage from "./components/pages/login/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./components/pages/adminPanel/adminDashboard";
import { HStack,Box } from "@chakra-ui/react";

function App() {
  return (
    <HStack>
      <Navbar />
      <Box position={"relative"} top={'100px'} >
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </Box>

      <Footer />
    </HStack>
  );
}

export default App;