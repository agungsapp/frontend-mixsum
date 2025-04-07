import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { CartProvider } from "./context/CartContext";
import MenuPage from "./pages/MenuPage";

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="flex min-h-screen max-w-[2000px] mx-auto flex-col bg-gray-100">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<MenuPage />} />
                        {/* Tambahkan route lain di sini jika diperlukan */}
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
