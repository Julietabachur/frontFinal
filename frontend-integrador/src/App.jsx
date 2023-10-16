
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import LandingPage from "./components/pages/landing/LandingPage";
import LoginPage from "./components/pages/login/LoginPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {


  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/home/:username" element={<HomePage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
