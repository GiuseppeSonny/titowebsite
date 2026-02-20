import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <Router>
      <div className={`App ${theme === "light" ? "theme-light" : "theme-dark"}`}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <div className="routes">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/about" exact element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/works" element={<Works />} />
            <Route path="/works/internal" element={<InternalWorks />} />
            <Route path="/works/external" element={<ExternalWorks />} />
            <Route path="/works/future" element={<FutureWorks />} />
            <Route path="/works/old" element={<OldWorks />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
