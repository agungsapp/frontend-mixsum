import { useState } from "react";
import LogoMixsum from "../assets/images/logo/mixsum-landscape.png";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // State untuk menu mobile

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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
                <ul className="hidden md:flex flex-row gap-4 text-white font-bold items-center">
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
