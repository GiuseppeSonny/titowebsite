import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./componets/Header/Header";
import Footer from "./componets/Header/footer/Footer";
import About from "./pages/aboutUs/About";
import Contacts from "./pages/contacts/Contacts";
import Works from "./pages/works/Works";
import Home from "./pages/home/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="routes">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/about" exact element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/works" element={<Works />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
