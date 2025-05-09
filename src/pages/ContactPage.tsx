import { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
import { FaWhatsapp, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { SiGojek, SiGrab } from "react-icons/si";

// Definisikan tipe untuk respons API cabang
interface BranchContact {
    id: number;
    branch_id: number;
    type: string;
    contact: string;
}

interface Branch {
    id: number;
    name: string;
    lat: number;
    long: number;
    branch_contact: BranchContact[];
}

// Komponen skeleton untuk kartu cabang
const BranchCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
            </div>
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
            </div>
        </div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="flex flex-wrap gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="h-10 w-24 bg-gray-200 rounded-full animate-pulse relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                </div>
            ))}
        </div>
    </div>
);

const ContactPage = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Data dummy cabang sebagai fallback (dikurangi menjadi 2 cabang)
    const dummyBranches: Branch[] = [
        {
            id: 1,
            name: "kedaton",
            lat: -5.3882406,
            long: 105.2525734,
            branch_contact: [
                {
                    id: 1,
                    branch_id: 1,
                    type: "whatsapp",
                    contact: "6287868767807",
                },
                {
                    id: 13,
                    branch_id: 1,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_153422_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-CZC2AVCDCYBDL2",
                },
                {
                    id: 24,
                    branch_id: 1,
                    type: "gofood",
                    contact: "https://gofood.link/a/yMa5Qvs",
                },
            ],
        },
        {
            id: 2,
            name: "korpri",
            lat: -5.3776707,
            long: 105.2938625,
            branch_contact: [
                {
                    id: 2,
                    branch_id: 2,
                    type: "whatsapp",
                    contact: "6289522282600",
                },
                {
                    id: 14,
                    branch_id: 2,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_153500_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C341J233EYNENX",
                },
                {
                    id: 25,
                    branch_id: 2,
                    type: "gofood",
                    contact: "https://gofood.link/a/GETUzLd",
                },
            ],
        },
    ];

    // Fetch data cabang
    useEffect(() => {
        const fetchBranches = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<Branch[]>("/branch");
                console.log("Branch API Response:", response.data);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setBranches(response.data);
                    setFilteredBranches(response.data);
                } else {
                    console.log("Empty branch API response, using dummy data");
                    setBranches(dummyBranches);
                    setFilteredBranches(dummyBranches);
                }
            } catch (error) {
                console.error("Error fetching branch data:", error);
                setBranches(dummyBranches);
                setFilteredBranches(dummyBranches);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, []);

    // Filter cabang berdasarkan pencarian
    useEffect(() => {
        const filtered = branches.filter((branch) =>
            branch.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBranches(filtered);
    }, [searchQuery, branches]);

    // Fungsi untuk menangani perubahan input pencarian
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Fungsi untuk merender ikon sosial media
    const renderSocialIcons = (branch: Branch) => {
        const contacts = branch.branch_contact;
        const socialIcons = [];

        // Tambahkan ikon Google Maps
        socialIcons.push(
            <a
                key={`maps-${branch.id}`}
                href={`https://www.google.com/maps?q=${branch.lat},${branch.long}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:scale-105 transition-all"
                aria-label={`View ${branch.name} on Google Maps`}
            >
                <FaMapMarkerAlt size={20} />
                <span>Maps</span>
            </a>
        );

        // Tambahkan ikon sosial media lainnya
        contacts.forEach((contact) => {
            const { type, contact: link } = contact;
            let Icon, label, bgColor, textColor, hoverBg;
            switch (type) {
                case "whatsapp":
                    Icon = FaWhatsapp;
                    label = "WhatsApp";
                    bgColor = "bg-green-50";
                    textColor = "text-green-600";
                    hoverBg = "hover:bg-green-100";
                    break;
                case "grabfood":
                    Icon = SiGrab;
                    label = "GrabFood";
                    bgColor = "bg-emerald-50";
                    textColor = "text-emerald-600";
                    hoverBg = "hover:bg-emerald-100";
                    break;
                case "gofood":
                    Icon = SiGojek;
                    label = "GoFood";
                    bgColor = "bg-red-50";
                    textColor = "text-red-600";
                    hoverBg = "hover:bg-red-100";
                    break;
                default:
                    return;
            }
            socialIcons.push(
                <a
                    key={contact.id}
                    href={
                        type === "whatsapp"
                            ? `https://wa.me/${link}?text=${encodeURIComponent(
                                  `Halo admin ${branch.name}`
                              )}`
                            : link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 ${bgColor} ${textColor} rounded-full ${hoverBg} hover:scale-105 transition-all`}
                    aria-label={`${
                        type === "whatsapp" ? "Contact" : "Order from"
                    } ${branch.name} via ${label}`}
                >
                    <Icon size={20} />
                    <span>{label}</span>
                </a>
            );
        });

        return socialIcons;
    };

    return (
        <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-red-600 mb-4">
                    Hubungi Kami
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Cari cabang terdekat dan hubungi admin kami melalui
                    WhatsApp, atau pesan langsung via GoFood dan GrabFood!
                </p>
            </div>
            <div className="mb-8 max-w-lg mx-auto relative">
                <FaSearch
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Cari cabang (misal: kedaton)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    aria-label="Search branches"
                />
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <BranchCardSkeleton key={index} />
                    ))}
                </div>
            ) : filteredBranches.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">
                    Tidak ada cabang yang ditemukan untuk pencarian Anda.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBranches.map((branch) => (
                        <div
                            key={branch.id}
                            className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FaMapMarkerAlt
                                    className="text-red-500"
                                    size={24}
                                />
                                <h2 className="text-xl font-bold text-gray-800 capitalize">
                                    Cabang {branch.name}
                                </h2>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Koordinat: {branch.lat}, {branch.long}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {renderSocialIcons(branch)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactPage;
