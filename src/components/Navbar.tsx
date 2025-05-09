import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoMixsum from "../assets/images/logo/mixsum-landscape.png";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Fungsi untuk menutup menu mobile
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Fungsi untuk scroll ke section
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Tangani klik link dengan section
    const handleNavClick = (path: string, sectionId?: string) => {
        toggleMenu(); // Tutup menu mobile
        if (location.pathname === path && sectionId) {
            // Jika sudah di halaman yang sama, langsung scroll
            scrollToSection(sectionId);
        } else {
            // Navigasi ke halaman baru, scroll akan ditangani oleh useEffect
            navigate(sectionId ? `${path}#${sectionId}` : path);
        }
    };

    // Tangani smooth scroll setelah navigasi
    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash) {
            setTimeout(() => {
                scrollToSection(hash);
            }, 100); // Delay untuk memastikan halaman selesai dirender
        }
    }, [location]);

    return (
        <div className="bg-white py-3 px-1">
            <div className="container mx-auto flex justify-between items-center rounded-2xl bg-red-700 px-6 py-5 md:px-10">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link to="/">
                        <img src={LogoMixsum} width="120" alt="Logo" />
                    </Link>
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
                <ul className="hidden md:flex flex-row gap-4 text-white font-bold items-center">
                    <li>
                        <Link
                            to="/"
                            className="hover:text-gray-200 transition-colors"
                            onClick={() => handleNavClick("/", "hero")}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/menu"
                            className="hover:text-gray-200 transition-colors"
                            onClick={() => handleNavClick("/menu")}
                        >
                            Produk
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/#cabang"
                            className="hover:text-gray-200 transition-colors"
                            onClick={() => handleNavClick("/", "cabang")}
                        >
                            Lokasi
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/#testimoni"
                            className="hover:text-gray-200 transition-colors"
                            onClick={() => handleNavClick("/", "testimoni")}
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contact"
                            className="hover:text-gray-200 transition-colors"
                            onClick={() => handleNavClick("/contact")}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>

                {/* Menu untuk Mobile */}
                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-red-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="flex justify-end p-5">
                        <button onClick={toggleMenu} aria-label="Close menu">
                            <HiX size={30} className="text-white" />
                        </button>
                    </div>
                    <ul className="flex flex-col gap-6 text-white font-bold text-lg p-6">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-gray-200 transition-colors"
                                onClick={() => handleNavClick("/", "hero")}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/menu"
                                className="hover:text-gray-200 transition-colors"
                                onClick={() => handleNavClick("/menu")}
                            >
                                Produk
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/#cabang"
                                className="hover:text-gray-200 transition-colors"
                                onClick={() => handleNavClick("/", "cabang")}
                            >
                                Lokasi
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/#testimoni"
                                className="hover:text-gray-200 transition-colors"
                                onClick={() => handleNavClick("/", "testimoni")}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-gray-200 transition-colors"
                                onClick={() => handleNavClick("/contact")}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Overlay untuk menu mobile */}
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
