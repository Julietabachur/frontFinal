import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import LoginPage from "./components/pages/login/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./components/pages/adminPanel/AdminDashboard";
import AdminPanel from "./components/pages/adminPanel/AdminPanel";
import { HStack, Box } from "@chakra-ui/react";
import DetailPage from "./components/pages/DetailPage";

function App() {
  return (
    <HStack>
      <Box position={"relative"} top={"100px"}>
        <Router>
          {<Navbar />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/detalle/:id" element={<DetailPage />} />

          </Routes>
          {<Footer />}
        </Router>
      </Box>
    </HStack>
  );
}

export default App;
