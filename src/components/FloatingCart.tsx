import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { HiShoppingCart, HiX } from "react-icons/hi";
import { apiClient } from "../utils/api";

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

// Komponen skeleton untuk daftar cabang
const BranchListSkeleton = () => (
    <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
        {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="py-2">
                <div className="h-5 w-3/4 bg-gray-300 rounded animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
                </div>
            </li>
        ))}
    </ul>
);

const FloatingCart = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoadingBranches, setIsLoadingBranches] = useState(true);

    // Ambil nilai dari CartContext
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("FloatingCart must be used within a CartProvider");
    }
    const { cart, removeFromCart, selectedBranch, setSelectedBranch } = context;

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

    // Fetch data cabang
    useEffect(() => {
        const fetchBranches = async () => {
            setIsLoadingBranches(true);
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
                setIsLoadingBranches(false);
            }
        };

        fetchBranches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fungsi untuk membuka/tutup pop-up keranjang
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
        if (isBranchModalOpen) setIsBranchModalOpen(false);
    };

    // Fungsi untuk membuka/tutup modal cabang
    const toggleBranchModal = () => {
        setIsBranchModalOpen(!isBranchModalOpen);
    };

    // Fungsi untuk memilih cabang
    const handleSelectBranch = (branch: Branch) => {
        const whatsappContact = branch.branch_contact.find(
            (contact) => contact.type === "whatsapp"
        )?.contact;
        if (whatsappContact) {
            setSelectedBranch(branch);
            setIsBranchModalOpen(false);
        } else {
            alert("Nomor WhatsApp untuk cabang ini tidak tersedia.");
        }
    };

    // Fungsi untuk menghasilkan pesan WhatsApp
    const generateWhatsAppMessage = () => {
        if (cart.length === 0) {
            return "Halo admin, saya mau pesan.";
        }

        const itemsText = cart
            .map(
                (item) =>
                    `${item.name} (x${item.quantity}) - Rp${(
                        item.price * item.quantity
                    ).toLocaleString()}`
            )
            .join("\n");

        const totalPrice = cart
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toLocaleString();

        return `Halo admin, saya mau pesan dari cabang ${selectedBranch?.name}:\n${itemsText}\n\nTotal: Rp${totalPrice}`;
    };

    // Fungsi untuk menangani klik tombol Checkout
    const handleCheckout = () => {
        if (!selectedBranch) {
            setIsBranchModalOpen(true);
            return;
        }

        const whatsappContact = selectedBranch.branch_contact.find(
            (contact) => contact.type === "whatsapp"
        )?.contact;
        if (!whatsappContact) {
            alert("Nomor WhatsApp untuk cabang ini tidak tersedia.");
            return;
        }

        const phoneNumber = whatsappContact.replace(/[^0-9]/g, "");
        const message = encodeURIComponent(generateWhatsAppMessage());
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
        setIsCartOpen(false);
    };

    return (
        <>
            {/* Ikon Keranjang Mengambang */}
            <button
                onClick={toggleCart}
                className="fixed bottom-6 right-6 bg-red-700 text-white rounded-full p-4 shadow-lg hover:bg-red-800 transition-all duration-300 z-50"
                aria-label="Open cart"
            >
                <HiShoppingCart size={24} />
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                )}
            </button>

            {/* Pop-up Keranjang */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative transform transition-all duration-300 animate-fadeIn">
                        <button
                            onClick={toggleCart}
                            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                            aria-label="Close cart"
                        >
                            <HiX size={24} />
                        </button>
                        <h2 className="text-lg font-bold mb-4">
                            Keranjang Belanja
                        </h2>
                        <div className="mb-4">
                            <p className="text-gray-700 text-sm">
                                Cabang:{" "}
                                {selectedBranch
                                    ? selectedBranch.name
                                    : "Belum dipilih"}
                            </p>
                            <button
                                className="text-red-600 hover:text-red-700 text-sm underline"
                                onClick={toggleBranchModal}
                                aria-label="Select or change branch"
                            >
                                {selectedBranch
                                    ? "Ganti Cabang"
                                    : "Pilih Cabang"}
                            </button>
                        </div>
                        {cart.length === 0 ? (
                            <p className="text-gray-700 text-sm">
                                Keranjang kosong
                            </p>
                        ) : (
                            <div>
                                <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                    {cart.map((item) => (
                                        <li
                                            key={item.id}
                                            className="py-2 flex justify-between items-center"
                                        >
                                            <span className="text-gray-700 text-sm">
                                                {item.name} (x{item.quantity}) -
                                                Rp
                                                {(
                                                    item.price * item.quantity
                                                ).toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                aria-label={`Remove ${item.name} from cart`}
                                            >
                                                Hapus
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 border-t pt-4">
                                    <p className="text-gray-700 font-bold">
                                        Total: Rp
                                        {cart
                                            .reduce(
                                                (total, item) =>
                                                    total +
                                                    item.price * item.quantity,
                                                0
                                            )
                                            .toLocaleString()}
                                    </p>
                                    <button
                                        className="mt-4 w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        onClick={handleCheckout}
                                        aria-label="Checkout via WhatsApp"
                                        disabled={cart.length === 0}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Pemilihan Cabang */}
            {isBranchModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative transform transition-all duration-300 animate-fadeIn">
                        <button
                            onClick={toggleBranchModal}
                            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                            aria-label="Close branch modal"
                        >
                            <HiX size={24} />
                        </button>
                        <h2 className="text-lg font-bold mb-4">Pilih Cabang</h2>
                        {isLoadingBranches ? (
                            <BranchListSkeleton />
                        ) : branches.length === 0 ? (
                            <p className="text-gray-700 text-sm">
                                Tidak ada cabang tersedia.
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                {branches.map((branch) => (
                                    <li key={branch.id} className="py-2">
                                        <button
                                            className="w-full text-left text-gray-700 hover:text-red-700 transition-colors capitalize"
                                            onClick={() =>
                                                handleSelectBranch(branch)
                                            }
                                            aria-label={`Select branch ${branch.name}`}
                                        >
                                            {branch.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingCart;
