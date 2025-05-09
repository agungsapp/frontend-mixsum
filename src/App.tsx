import "./App.css";
import { useState, useEffect, useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { CartProvider, CartContext } from "./context/CartContext";
import FloatingCart from "./components/FloatingCart";
import BranchPromptModal from "./components/BranchPromptModal";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import Navbar from "./components/Navbar";
import ContactPage from "./pages/ContactPage";

function AppContent() {
    const [hasShownModal, setHasShownModal] = useState(false);
    const location = useLocation();

    // Akses CartContext
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("AppContent must be used within a CartProvider");
    }
    const { selectedBranch, cart, showBranchModal, setShowBranchModal } =
        context;

    // Log perubahan rute dan isi keranjang
    useEffect(() => {
        console.log(
            "Route changed to:",
            location.pathname,
            "Current cart:",
            cart
        );
    }, [location, cart]);

    // Tampilkan modal setelah 10 detik jika belum ada cabang dan keranjang kosong
    useEffect(() => {
        if (!selectedBranch && cart.length === 0 && !hasShownModal) {
            const timer = setTimeout(() => {
                setShowBranchModal(true);
                setHasShownModal(true);
            }, 10000); // 10 detik

            return () => clearTimeout(timer);
        }
    }, [selectedBranch, cart, hasShownModal, setShowBranchModal]);

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
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
