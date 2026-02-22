import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./componets/Header/Header";
import Footer from "./componets/Header/footer/Footer";
import About from "./pages/aboutUs/About";
import Contacts from "./pages/contacts/Contacts";
import Works from "./pages/works/Works";
import InternalWorks from "./pages/works/InternalWorks";
import ExternalWorks from "./pages/works/ExternalWorks";
import FutureWorks from "./pages/works/FutureWorks";
import OldWorks from "./pages/works/OldWorks";
import Home from "./pages/home/Home";
import Photos from "./pages/photos/Photos";
import AdminPage from "./admin/AdminPage";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

const AppLayout = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Add dev-mode class to body when in admin
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('dev-mode');
    } else {
      document.body.classList.remove('dev-mode');
    }
    
    return () => {
      document.body.classList.remove('dev-mode');
    };
  }, [isAdmin]);

  return (
    <div className={`App ${theme === "light" ? "theme-light" : "theme-dark"}`}>
      {!isAdmin && <Header theme={theme} onToggleTheme={toggleTheme} />}
      <div className={isAdmin ? "" : "routes"}>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/internal" element={<InternalWorks />} />
          <Route path="/works/external" element={<ExternalWorks />} />
          <Route path="/works/future" element={<FutureWorks />} />
          <Route path="/works/old" element={<OldWorks />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppLayout theme={theme} toggleTheme={toggleTheme} />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
