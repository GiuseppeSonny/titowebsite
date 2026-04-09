import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./componets/Header/Header";
import Footer from "./componets/Header/footer/Footer";
import Loading from "./pages/loading/Loading";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider, useData } from "./context/DataContext";

// Lazy load components for better performance
const About = React.lazy(() => import("./pages/aboutUs/About"));
const Contacts = React.lazy(() => import("./pages/contacts/Contacts"));
const Works = React.lazy(() => import("./pages/works/Works"));
const InternalWorks = React.lazy(() => import("./pages/works/InternalWorks"));
const ExternalWorks = React.lazy(() => import("./pages/works/ExternalWorks"));
const Home = React.lazy(() => import("./pages/home/Home"));
const Products = React.lazy(() => import("./pages/products/Products"));
const AdminPage = React.lazy(() => import("./admin/AdminPage"));

const FontProvider = ({ children }) => {
  const { home } = useData();
  useEffect(() => {
    if (home?.fonts) {
      const root = document.documentElement;
      root.style.setProperty('--font-heading', home.fonts.heading);
      root.style.setProperty('--font-body', home.fonts.body);
      root.style.setProperty('--font-mono', home.fonts.mono);
    }
  }, [home?.fonts]);
  return children;
};

const AppContent = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { connectionError } = useData();
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

  if (connectionError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
        <h2>Connection Error</h2>
        <p>Unable to load content. Please check your internet connection and try again.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`App ${theme === "light" ? "theme-light" : "theme-dark"}`}>
      {!isAdmin && <Header theme={theme} onToggleTheme={toggleTheme} />}
      <div className={isAdmin ? "" : "routes"}>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/about" exact element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/works" element={<Works />} />
            <Route path="/works/internal" element={<InternalWorks />} />
            <Route path="/works/external" element={<ExternalWorks />} />
            <Route path="/products" element={<Products />} />
            <Route path="/photos" element={<Navigate to="/products" replace />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  const [showLoading, setShowLoading] = useState(true);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    // Show loading for minimum 500ms for smooth UX, then hide when ready
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <FontProvider>
            <AppContent theme={theme} toggleTheme={toggleTheme} />
          </FontProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
