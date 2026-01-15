import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import LogoMixsum from "../assets/images/logo/mixsum-landscape.png";

const Footer = () => {
    return (
        <footer className="bg-red-800 py-10 text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                    {/* Bagian 1: Logo dan Deskripsi */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                        <img
                            src={LogoMixsum}
                            alt="Mixsum Logo"
                            className="w-32 mb-4"
                        />
                        <p className="text-gray-200 text-sm max-w-xs">
                            Nikmati dimsum lezat dengan cita rasa istimewa.
                            Temukan cabang terdekat dan rasakan pengalaman
                            kuliner terbaik!
                        </p>
                    </div>

                    {/* Bagian 2: Kontak dan Sosial Media */}
                    <div className="flex flex-col items-center text-center md:items-end md:text-right">
                        <h4 className="mb-4 text-lg font-semibold text-gray-100">
                            Hubungi Kami
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-center gap-2 md:justify-end">
                                <FaInstagram
                                    className="text-gray-300"
                                    size={18}
                                />
                                <a
                                    href="https://instagram.com/mixsumdimsum"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 text-sm hover:text-white transition-all duration-200 hover:underline"
                                >
                                    @mixsumdimsum
                                </a>
                            </li>
                            <li className="flex items-center justify-center gap-2 md:justify-end">
                                <FaInstagram
                                    className="text-gray-300"
                                    size={18}
                                />
                                <a
                                    href="https://instagram.com/mixsumdimsum_plg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 text-sm hover:text-white transition-all duration-200 hover:underline"
                                >
                                    @mixsumdimsum_plg
                                </a>
                            </li>
                            <li className="flex items-center justify-center gap-2 md:justify-end">
                                <FaWhatsapp className="text-gray-300" size={18} />
                                <a
                                    href="https://wa.me/62895417877419"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 text-sm hover:text-white transition-all duration-200 hover:underline"
                                >
                                    +62 895-4178-77419
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-gray-600 pt-4 text-center">
                    <p className="text-gray-300 text-sm">
                        &copy; {new Date().getFullYear()} Mixsum. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;