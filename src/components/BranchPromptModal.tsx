import { useState, useEffect, useContext } from "react";
import { HiX } from "react-icons/hi";
import { apiClient } from "../utils/api";
import { CartContext } from "../context/CartContext";

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

interface BranchPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Komponen skeleton untuk daftar cabang
const BranchListSkeleton = () => (
    <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto mb-6">
        {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="py-2">
                <div className="h-5 w-3/4 bg-gray-300 rounded animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
                </div>
            </li>
        ))}
    </ul>
);

const BranchPromptModal = ({ isOpen, onClose }: BranchPromptModalProps) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeGreeting, setTimeGreeting] = useState("");

    // Akses CartContext
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("BranchPromptModal must be used within a CartProvider");
    }
    const { selectedBranch, setSelectedBranch, setShowBranchModal } = context;

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
    ];

    // Muat selectedBranch dari localStorage saat komponen dimuat
    useEffect(() => {
        const savedBranch = localStorage.getItem("selectedBranch");
        if (savedBranch) {
            try {
                const parsedBranch: Branch = JSON.parse(savedBranch);
                setSelectedBranch(parsedBranch);
                setShowBranchModal(false);
            } catch (error) {
                console.error("Error parsing saved branch:", error);
                localStorage.removeItem("selectedBranch");
            }
        }
    }, [setSelectedBranch, setShowBranchModal]);

    // Fetch data cabang
    useEffect(() => {
        const fetchBranches = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<Branch[]>("/branch");
                console.log("Branch API Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    setBranches(response.data);
                } else {
                    console.log("Empty branch API response, using dummy data");
                    setBranches(dummyBranches);
                }
            } catch (error) {
                console.error("Error fetching branch data:", error);
                setBranches(dummyBranches);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Tentukan pesan berdasarkan waktu
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 11) {
            setTimeGreeting("Pagi-pagi");
        } else if (hour >= 11 && hour < 15) {
            setTimeGreeting("Siang-siang");
        } else if (hour >= 15 && hour < 18) {
            setTimeGreeting("Sore-sore");
        } else {
            setTimeGreeting("Malam-malam");
        }
    }, []);

    // Fungsi untuk memilih cabang
    const handleSelectBranch = (branch: Branch) => {
        const whatsappContact = branch.branch_contact.find(
            (contact) => contact.type === "whatsapp"
        )?.contact;
        if (whatsappContact) {
            setSelectedBranch(branch);
            localStorage.setItem("selectedBranch", JSON.stringify(branch));
            setShowBranchModal(false);
            onClose();
        } else {
            alert("Nomor WhatsApp untuk cabang ini tidak tersedia.");
        }
    };

    // Fungsi untuk menutup modal
    const handleClose = () => {
        setShowBranchModal(false);
        onClose();
    };

    // Hanya tampilkan modal jika belum ada selectedBranch
    if (!isOpen || selectedBranch) return null;

    return (
        <div className="fixed inset-0 bg-black/75 z-[999] flex items-center justify-center">
            <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative transform transition-all duration-300 animate-fadeIn">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                    aria-label="Close branch prompt modal"
                >
                    <HiX size={24} />
                </button>
                <h2 className="text-lg font-bold text-red-700 mb-4">
                    Pilih Cabang Dulu, Yuk!
                </h2>
                <p className="text-gray-700 text-sm mb-6">
                    {timeGreeting} enaknya mamam dimsum, nih! Tapi sebelum
                    lanjut, yuk pilih cabang yang paling deket sama kamu!
                </p>
                {isLoading ? (
                    <BranchListSkeleton />
                ) : branches.length === 0 ? (
                    <p className="text-gray-700 text-sm">
                        Tidak ada cabang tersedia.
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto mb-6">
                        {branches.map((branch) => (
                            <li key={branch.id} className="py-2">
                                <button
                                    className="w-full text-left text-gray-700 hover:text-red-700 transition-colors capitalize"
                                    onClick={() => handleSelectBranch(branch)}
                                    aria-label={`Select branch ${branch.name}`}
                                >
                                    {branch.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={handleClose}
                    aria-label="Defer branch selection"
                >
                    Nanti Aja
                </button>
            </div>
        </div>
    ); 
};

export default BranchPromptModal;
