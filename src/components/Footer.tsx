import { FaEnvelope, FaInstagram, FaPhone, FaWhatsapp } from "react-icons/fa"; // Ikon sosial media dan kontak

const Footer = () => {
    return (
        <footer className="bg-red-800 py-12 text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col justify-between gap-8 md:flex-row">
                    {/* Bagian 1: Logo/Nama Brand */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                        <h3 className="mb-4 text-2xl font-bold text-white">
                            Mixsum
                        </h3>
                        <p className="text-gray-200">
                            Dimsum lezat untuk semua, temukan cabang terdekatmu!
                        </p>
                    </div>

                    {/* Bagian 2: Link Navigasi */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                        <h4 className="mb-4 text-lg font-semibold text-gray-200">
                            Navigasi
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/"
                                    className="text-gray-300 transition-all duration-200 hover:text-white hover:underline"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/cabang"
                                    className="text-gray-300 transition-all duration-200 hover:text-white hover:underline"
                                >
                                    Cabang
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/produk"
                                    className="text-gray-300 transition-all duration-200 hover:text-white hover:underline"
                                >
                                    Produk
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/kontak"
                                    className="text-gray-300 transition-all duration-200 hover:text-white hover:underline"
                                >
                                    Kontak
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Bagian 3: Kontak dan Sosial Media */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                        <h4 className="mb-4 text-lg font-semibold text-gray-200">
                            Hubungi Kami
                        </h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-300" />
                                <a
                                    href="mailto:info@mixsum.com"
                                    className="text-gray-300 transition-all duration-200 hover:text-white hover:underline"
                                >
                                    info@mixsum.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FaPhone className="text-gray-300" />
                                <a
                                    href="tel:+6281234567890"
                                    className="text-gray-300 transition-all duration-200 hover:text-white hover:underline"
                                >
                                    +62 812-3456-7890
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 flex gap-4">
                            <a
                                href="https://instagram.com/mixsum"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 transition-all duration-200 hover:text-white"
                            >
                                <FaInstagram size={24} />
                            </a>
                            <a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 transition-all duration-200 hover:text-white"
                            >
                                <FaWhatsapp size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-white pt-4 text-center">
                    <p className="text-gray-300">
                        © 2025 Mixsum. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
