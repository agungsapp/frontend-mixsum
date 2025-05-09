import { useState, useEffect } from "react";
import { apiClient } from "../utils/api";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
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
    <div className="bg-white rounded-lg shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg">
        <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="h-8 w-8 bg-gray-300 rounded-full animate-pulse relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
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

    // Data dummy cabang sebagai fallback
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
        {
            id: 3,
            name: "kemiling",
            lat: -5.399989,
            long: 105.2081048,
            branch_contact: [
                {
                    id: 3,
                    branch_id: 3,
                    type: "whatsapp",
                    contact: "62895425423243",
                },
                {
                    id: 15,
                    branch_id: 3,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_153518_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C4DAEB2KHE5ZEN",
                },
                {
                    id: 26,
                    branch_id: 3,
                    type: "gofood",
                    contact: "https://gofood.link/a/HL5VsSU",
                },
            ],
        },
        {
            id: 4,
            name: "pahoman",
            lat: -5.4276036,
            long: 105.2699503,
            branch_contact: [
                {
                    id: 4,
                    branch_id: 4,
                    type: "whatsapp",
                    contact: "62895425423239",
                },
                {
                    id: 16,
                    branch_id: 4,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_153542_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C4DAJJVZFEEDTN",
                },
                {
                    id: 27,
                    branch_id: 4,
                    type: "gofood",
                    contact: "https://gofood.link/a/HL6cVQC",
                },
            ],
        },
        {
            id: 5,
            name: "panjang",
            lat: -5.4761532,
            long: 105.3226232,
            branch_contact: [
                {
                    id: 5,
                    branch_id: 5,
                    type: "whatsapp",
                    contact: "6289616709447",
                },
                {
                    id: 17,
                    branch_id: 5,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_153611_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C6DDNBT2WBETME",
                },
                {
                    id: 28,
                    branch_id: 5,
                    type: "gofood",
                    contact: "https://gofood.link/a/L9L8Ykf",
                },
            ],
        },
        {
            id: 6,
            name: "sukabumi",
            lat: -5.3949869,
            long: 105.2968759,
            branch_contact: [
                {
                    id: 6,
                    branch_id: 6,
                    type: "whatsapp",
                    contact: "6289653733698",
                },
                {
                    id: 18,
                    branch_id: 6,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_153628_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C6XCATDXC2DJRA",
                },
            ],
        },
        {
            id: 7,
            name: "metro",
            lat: -5.1195301,
            long: 105.3193397,
            branch_contact: [
                {
                    id: 7,
                    branch_id: 7,
                    type: "whatsapp",
                    contact: "6282182806524",
                },
                {
                    id: 19,
                    branch_id: 7,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_154323_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C3WFT4CTT4AJL6",
                },
                {
                    id: 29,
                    branch_id: 7,
                    type: "gofood",
                    contact: "https://gofood.link/a/HL67X75",
                },
            ],
        },
        {
            id: 8,
            name: "bandar jaya",
            lat: -4.938869,
            long: 105.2129595,
            branch_contact: [
                {
                    id: 8,
                    branch_id: 8,
                    type: "whatsapp",
                    contact: "62895378036363",
                },
                {
                    id: 20,
                    branch_id: 8,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_154522_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C6ACGJJFJLCHUA",
                },
            ],
        },
        {
            id: 9,
            name: "pringsewu",
            lat: -5.3621924,
            long: 104.9985467,
            branch_contact: [
                {
                    id: 9,
                    branch_id: 9,
                    type: "whatsapp",
                    contact: "62895378166996",
                },
                {
                    id: 21,
                    branch_id: 9,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_154438_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C4N2RUTBT3KTLX",
                },
                {
                    id: 30,
                    branch_id: 9,
                    type: "gofood",
                    contact: "https://gofood.link/a/Ks75BrA",
                },
            ],
        },
        {
            id: 10,
            name: "natar",
            lat: -5.3111473,
            long: 105.1947999,
            branch_contact: [
                {
                    id: 10,
                    branch_id: 10,
                    type: "whatsapp",
                    contact: "6289616709465",
                },
                {
                    id: 22,
                    branch_id: 10,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_154417_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C6C2CN4BHGKVRA",
                },
                {
                    id: 31,
                    branch_id: 10,
                    type: "gofood",
                    contact: "https://gofood.link/a/LmKtYTS",
                },
            ],
        },
        {
            id: 11,
            name: "kota bumi",
            lat: -4.842095,
            long: 104.9038352,
            branch_contact: [
                {
                    id: 11,
                    branch_id: 11,
                    type: "whatsapp",
                    contact: "62895401803933",
                },
            ],
        },
        {
            id: 12,
            name: "palembang",
            lat: -2.9362243,
            long: 104.734344,
            branch_contact: [
                {
                    id: 12,
                    branch_id: 12,
                    type: "whatsapp",
                    contact: "628117290027",
                },
                {
                    id: 23,
                    branch_id: 12,
                    type: "grabfood",
                    contact:
                        "https://r.grab.com/g/6-20250315_160141_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C6TENGAYAKTYT2",
                },
                {
                    id: 32,
                    branch_id: 12,
                    type: "gofood",
                    contact: "https://gofood.link/a/Ks75BrA",
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
                className="text-blue-500 flex gap-3 hover:text-blue-600 transition-colors"
                aria-label={`View ${branch.name} on Google Maps`}
            >
                <FaMapMarkerAlt size={24} />
                Maps
            </a>
        );

        // Tambahkan ikon sosial media lainnya
        contacts.forEach((contact) => {
            const { type, contact: link } = contact;
            let Icon;
            let label;
            switch (type) {
                case "whatsapp":
                    Icon = FaWhatsapp;
                    label = "WhatsApp";
                    socialIcons.push(
                        <a
                            key={contact.id}
                            href={`https://wa.me/${link}?text=${encodeURIComponent(
                                `Halo admin ${branch.name}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 flex gap-3 hover:text-green-600 transition-colors"
                            aria-label={`Contact ${branch.name} via ${label}`}
                        >
                            <Icon size={24} />
                            {label}
                        </a>
                    );
                    break;
                case "grabfood":
                    Icon = SiGrab;
                    label = "GrabFood";
                    socialIcons.push(
                        <a
                            key={contact.id}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 flex gap-3 hover:text-green-600 transition-colors"
                            aria-label={`Order from ${branch.name} via ${label}`}
                        >
                            <Icon size={24} />
                            {label}
                        </a>
                    );
                    break;
                case "gofood":
                    Icon = SiGojek; // Placeholder
                    label = "GoFood";
                    socialIcons.push(
                        <a
                            key={contact.id}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 flex gap-3 hover:text-green-600 transition-colors"
                            aria-label={`Order from ${branch.name} via ${label}`}
                        >
                            <Icon size={24} />
                            {label}
                        </a>
                    );
                    break;
                default:
                    break;
            }
        });

        return socialIcons;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
                Mau langsung chat admin ?
            </h1>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Cari cabang (misal: kedaton)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
                    aria-label="Search branches"
                />
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <BranchCardSkeleton key={index} />
                    ))}
                </div>
            ) : filteredBranches.length === 0 ? (
                <p className="text-gray-700 text-center">
                    Tidak ada cabang yang ditemukan.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {filteredBranches.map((branch) => (
                        <div
                            key={branch.id}
                            className="bg-white rounded-lg shadow-md p-6 transform transition-all hover:scale-105 hover:shadow-lg"
                        >
                            <h2 className="text-xl font-bold text-gray-800 capitalize mb-2">
                                Cabang {branch.name}
                            </h2>

                            <div className="grid grid-cols-2 gap-4 flex-wrap">
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
