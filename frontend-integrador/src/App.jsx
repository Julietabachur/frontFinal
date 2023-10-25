
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import LandingPage from "./components/pages/landing/LandingPage";
import LoginPage from "./components/pages/login/LoginPage";
import Footer from "./components/Footer";
<<<<<<< Updated upstream
import Navbar from "./components/Navbar";
=======
import AdminDashboard from "./components/pages/adminPanel/adminDashboard";
import { HStack, Box } from "@chakra-ui/react";
import  Detail  from "./components/Detail/Detail";

>>>>>>> Stashed changes

function App() {


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
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/detail/:id" element={<Detail/>} />
            

          </Routes>
          <Footer />
        </Router>
      </Box>
    </HStack>
>>>>>>> Stashed changes
  );
}

export default App;
