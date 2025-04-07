import React, { useContext } from "react";
import { CartContext } from "../context/CartContext"; // Import CartContext
import LogoMixsum from "../assets/images/logo/mixsum-landscape.png";
import { HiMenuAlt3, HiX, HiShoppingCart } from "react-icons/hi"; // Tambahkan ikon keranjang

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false); // State untuk mengontrol menu mobile

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle menu mobile
    };

    // Ambil nilai dari CartContext
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("CartContext must be used within a CartProvider");
    }

    const { cart } = context;

    return (
        <div className="bg-white py-3 px-1">
            <div className="container mx-auto flex justify-between items-center rounded-2xl bg-red-700 px-6 py-5 md:px-10">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <a href="/">
                        <img src={LogoMixsum} width="120" alt="Logo" />
                    </a>
                </div>

                {/* Hamburger Icon (hanya muncul di mobile) */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} aria-label="Toggle menu">
                        {isOpen ? (
                            <HiX size={30} className="text-white" />
                        ) : (
                            <HiMenuAlt3 size={30} className="text-white" />
                        )}
                    </button>
                </div>

                {/* Menu untuk Desktop */}
                <ul className="hidden md:flex flex-row gap-4 text-white font-bold">
                    <li>
                        <a
                            href="#"
                            className="hover:text-gray-200 transition-colors"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="hover:text-gray-200 transition-colors"
                        >
                            Produk
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="hover:text-gray-200 transition-colors"
                        >
                            Lokasi
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="hover:text-gray-200 transition-colors"
                        >
                            About
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="hover:text-gray-200 transition-colors"
                        >
                            Contact
                        </a>
                    </li>
                    {/* Tombol Keranjang */}
                    <li className="relative">
                        <button className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                            <HiShoppingCart size={24} />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </li>
                </ul>

                {/* Menu untuk Mobile (muncul saat hamburger diklik) */}
                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-red-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Tombol Tutup di Menu Mobile */}
                    <div className="flex justify-end p-5">
                        <button onClick={toggleMenu} aria-label="Close menu">
                            <HiX size={30} className="text-white" />
                        </button>
                    </div>

                    {/* Daftar Menu Mobile */}
                    <ul className="flex flex-col gap-6 text-white font-bold text-lg p-6">
                        <li>
                            <a
                                href="#"
                                className="hover:text-gray-200 transition-colors"
                                onClick={toggleMenu}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-gray-200 transition-colors"
                                onClick={toggleMenu}
                            >
                                Produk
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-gray-200 transition-colors"
                                onClick={toggleMenu}
                            >
                                Lokasi
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-gray-200 transition-colors"
                                onClick={toggleMenu}
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="hover:text-gray-200 transition-colors"
                                onClick={toggleMenu}
                            >
                                Contact
                            </a>
                        </li>
                        {/* Tombol Keranjang di Mobile */}
                        <li className="relative">
                            <button className="flex items-center gap-1 hover:text-gray-200 transition-colors">
                                <HiShoppingCart size={24} />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Overlay (untuk menutup menu saat klik di luar) */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                        onClick={toggleMenu}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
