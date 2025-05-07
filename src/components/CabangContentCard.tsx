import { FaWhatsapp, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { SiGojek, SiShopee, SiGrab } from "react-icons/si";

const branches = [
    {
        name: "Cabang Palembang 1",
        address: "Jl. Sudirman No.123, Palembang",
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5803904593286!2d104.7294730836391!3d-2.936218932005317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75003506d3bb%3A0xa6aafe0b7fbcdc66!2sMIXSUM%20DIMSUM%20PALEMBANG!5e0!3m2!1sid!2sid!4v1745429991882!5m2!1sid!2sid",
        whatsapp: "https://wa.me/6281234567890",
        instagram: "https://instagram.com/mixsum_palembang1",
        gofood: "https://gofood.link/a/example1",
        grabfood: "https://grab.link/a/example1",
        shopeefood: "https://shopee.co.id/mixsum_palembang1",
    },
    {
        name: "Cabang Palembang 2",
        address: "Jl. Veteran No.456, Palembang",
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5803904593286!2d104.7294730836391!3d-2.936218932005317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75003506d3bb%3A0xa6aafe0b7fbcdc66!2sMIXSUM%20DIMSUM%20PALEMBANG!5e0!3m2!1sid!2sid!4v1745429991882!5m2!1sid!2sid",
        whatsapp: "https://wa.me/6281234567891",
        instagram: "https://instagram.com/mixsum_palembang2",
        gofood: "https://gofood.link/a/example2",
        grabfood: "https://grab.link/a/example2",
        shopeefood: "https://shopee.co.id/mixsum_palembang2",
    },
    {
        name: "Cabang Palembang 3",
        address: "Jl. Merdeka No.789, Palembang",
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5803904593286!2d104.7294730836391!3d-2.936218932005317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75003506d3bb%3A0xa6aafe0b7fbcdc66!2sMIXSUM%20DIMSUM%20PALEMBANG!5e0!3m2!1sid!2sid!4v1745429991882!5m2!1sid!2sid",
        whatsapp: "https://wa.me/6281234567892",
        instagram: "https://instagram.com/mixsum_palembang3",
        gofood: "https://gofood.link/a/example3",
        grabfood: "https://grab.link/a/example3",
        shopeefood: "https://shopee.co.id/mixsum_palembang3",
    },
];

const CabangContentCard = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {(() => {
                const elements = [];
                for (let i = 0; i < branches.length && i < 12; i++) {
                    const branch = branches[i];
                    elements.push(
                        <div
                            key={i}
                            className="group relative rounded-3xl bg-white/80 backdrop-blur-lg border border-gradient-to-r from-orange-200 to-red-200 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 hover:scale-105 animate-fade-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="p-6 text-center">
                                <h5 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
                                    {branch.name}
                                </h5>
                                <div className="flex items-center justify-center mb-4 text-gray-600">
                                    <FaMapMarkerAlt className="mr-2 text-red-500 text-lg" />
                                    <p className="text-base font-medium">
                                        {branch.address}
                                    </p>
                                </div>
                                <a
                                    href={branch.maps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mb-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
                                >
                                    View on Map
                                </a>
                                <div className="flex justify-center gap-4">
                                    <a
                                        href={branch.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative p-3 rounded-full bg-green-500/20 text-green-600 hover:bg-green-500/40 hover:text-green-700 transition-all duration-300 hover:scale-110 group/icon"
                                        aria-label="WhatsApp"
                                    >
                                        <FaWhatsapp size={18} />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200">
                                            WhatsApp
                                        </span>
                                    </a>
                                    <a
                                        href={branch.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative p-3 rounded-full bg-pink-500/20 text-pink-600 hover:bg-pink-500/40 hover:text-pink-700 transition-all duration-300 hover:scale-110 group/icon"
                                        aria-label="Instagram"
                                    >
                                        <FaInstagram size={18} />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200">
                                            Instagram
                                        </span>
                                    </a>
                                    <a
                                        href={branch.gofood}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative p-3 rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/40 hover:text-red-700 transition-all duration-300 hover:scale-110 group/icon"
                                        aria-label="GoFood"
                                    >
                                        <SiGojek size={18} />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200">
                                            GoFood
                                        </span>
                                    </a>
                                    <a
                                        href={branch.grabfood}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative p-3 rounded-full bg-green-600/20 text-green-700 hover:bg-green-600/40 hover:text-green-800 transition-all duration-300 hover:scale-110 group/icon"
                                        aria-label="GrabFood"
                                    >
                                        <SiGrab size={18} />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200">
                                            GrabFood
                                        </span>
                                    </a>
                                    <a
                                        href={branch.shopeefood}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative p-3 rounded-full bg-orange-500/20 text-orange-600 hover:bg-orange-500/40 hover:text-orange-700 transition-all duration-300 hover:scale-110 group/icon"
                                        aria-label="ShopeeFood"
                                    >
                                        <SiShopee size={18} />
                                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200">
                                            ShopeeFood
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                }
                return elements;
            })()}
        </div>
    );
};

export default CabangContentCard;
