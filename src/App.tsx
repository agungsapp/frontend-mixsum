import "./App.css";
import { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { CartProvider, CartContext } from "./context/CartContext";
import FloatingCart from "./components/FloatingCart";
import BranchPromptModal from "./components/BranchPromptModal";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import Navbar from "./components/Navbar";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";

function AppContent() {
  const [hasShownModal, setHasShownModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Akses CartContext
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("AppContent must be used within a CartProvider");
  }
  const { selectedBranch, cart, showBranchModal, setShowBranchModal } = context;

  // Intercept klik pada <a> untuk navigasi client-side
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A" && target.getAttribute("href")) {
        const href = target.getAttribute("href");
        if (href?.startsWith("/")) {
          event.preventDefault();
          navigate(href);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [navigate]);

  // Log perubahan rute dan isi keranjang
  useEffect(() => {
    console.log("Route changed to:", location.pathname, "Current cart:", cart);
  }, [location, cart]);

  // Tampilkan modal setelah 10 detik jika belum ada cabang dan keranjang kosong
  useEffect(() => {
    if (!selectedBranch && cart.length === 0 && !hasShownModal) {
      const timer = setTimeout(() => {
        setShowBranchModal(true);
        setHasShownModal(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [selectedBranch, cart, hasShownModal, setShowBranchModal]);

  // Cek versi untuk cache busting
  useEffect(() => {
    fetch("/version.json?t=" + new Date().getTime())
      .then((res) => res.json())
      .then((data) => {
        const localVersion = localStorage.getItem("appVersion");
        if (localVersion !== data.version) {
          localStorage.setItem("appVersion", data.version);
          // Ganti dengan reload sederhana atau navigasi dengan query acak
          window.location.reload(); // Reload tanpa cache
          // Alternatif: window.location.href = window.location.pathname + "?t=" + new Date().getTime();
        }
      })
      .catch((err) => console.error("Version check failed:", err));
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
      <FloatingCart />
      <BranchPromptModal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
      />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;