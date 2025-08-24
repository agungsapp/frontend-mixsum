import { useContext, useState, useEffect, Component, useRef, useCallback } from "react";
import { CartContext } from "../context/CartContext";
import { HiShoppingCart, HiX } from "react-icons/hi";
import { apiClient } from "../utils/api";
import Swal from "sweetalert2";

// Error Boundary dengan tipe props yang benar
interface ErrorBoundaryProps {
    children: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                    <div className="text-center p-6">
                        <h2 className="text-xl font-bold text-red-600">Terjadi Kesalahan</h2>
                        <p className="text-gray-700">Silakan coba lagi atau hubungi admin.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800"
                        >
                            Muat Ulang
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

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

// Definisikan tipe Promo (sesuai dengan Promo.tsx)
interface Promo {
    id: number;
    type: "single" | "bundling";
    description: string;
    discount_value: string | null;
    start_date: string;
    end_date: string;
    status: string;
    product: {
        id: number;
        name: string;
        slug: string;
        description: string;
        path: string;
        price: string;
    } | null;
    products: {
        id: number;
        name: string;
        slug: string;
        description: string;
        path: string;
        price: string;
    }[];
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
    const [activePromos, setActivePromos] = useState<Promo[]>([]);

    // Use useRef to store mount status
    const isMountedRef = useRef(true);

    // Ambil nilai dari CartContext
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("FloatingCart must be used within a CartProvider");
    }
    const { cart, removeFromCart, selectedBranch, setSelectedBranch, setCart } = context;

    // Data dummy cabang
    const dummyBranches: Branch[] = [
        {
            id: 1,
            name: "kedaton",
            lat: -5.3882406,
            long: 105.2525734,
            branch_contact: [
                { id: 1, branch_id: 1, type: "whatsapp", contact: "6287868767807" },
                {
                    id: 13,
                    branch_id: 1,
                    type: "grabfood",
                    contact: "https://r.grab.com/g/6-20250315_153422_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-CZC2AVCDCYBDL2",
                },
                { id: 24, branch_id: 1, type: "gofood", contact: "https://gofood.link/a/yMa5Qvs" },
            ],
        },
    ];

    // Function untuk fetch branches
    const fetchBranches = useCallback(async () => {
        if (!isMountedRef.current) return;

        setIsLoadingBranches(true);
        try {
            console.log("Fetching branches...");
            const response = await apiClient.get<Branch[]>("/branch");

            if (!isMountedRef.current) return;

            if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                console.log("Branches loaded:", response.data);
                setBranches(response.data);
            } else {
                console.log("No branches found, using dummy data");
                setBranches(dummyBranches);
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
            if (isMountedRef.current) {
                setBranches(dummyBranches);
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoadingBranches(false);
            }
        }
    }, []);

    // Fetch data cabang hanya sekali saat component mount
    useEffect(() => {
        fetchBranches();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchBranches]);

    // Effect untuk fetch promos dan validasi saat cart dibuka
    useEffect(() => {
        if (isCartOpen) {
            console.log("Cart opened, reading active promos from localStorage...");
            const storedPromos = localStorage.getItem("activePromos");
            if (storedPromos) {
                const parsedPromos: Promo[] = JSON.parse(storedPromos);
                setActivePromos(parsedPromos);
                console.log("Active Promos from localStorage:", parsedPromos);
            } else {
                console.log("No promos found in localStorage, setting empty array");
                setActivePromos([]);
            }
        } else {
            console.log("Cart closed, resetting active promos");
            setActivePromos([]); // Reset saat ditutup
        }

        // Cleanup saat unmount
        return () => {
            isMountedRef.current = false;
        };
    }, [isCartOpen]);

    // Effect untuk validasi promo expired
    // Effect untuk validasi promo expired
    useEffect(() => {
        if (!isCartOpen || cart.length === 0 || !setCart) {
            return;
        }

        console.log("Validating expired promos...", { activePromos, cart });

        const now = new Date();
        let hasExpiredItems = false;

        const validatedCart = cart.filter((item) => {
            if (!item.promoId) {
                return true; // Biarkan item non-promo
            }

            // Jika activePromos kosong (tidak ada di localStorage), hapus semua item dengan promoId
            if (activePromos.length === 0) {
                hasExpiredItems = true;
                console.log(`Removing promo item (no active promos): ${item.name}`);
                Swal.fire({
                    icon: "warning",
                    title: "Promo Tidak Tersedia",
                    text: `${item.name} telah dihapus karena tidak ada promo aktif.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                return false;
            }

            // Jika activePromos ada, periksa kecocokan promo dan expired
            const promo = activePromos.find((p) => p.id === item.promoId);
            if (!promo || new Date(promo.end_date) < now) {
                hasExpiredItems = true;
                console.log(`Removing expired promo item: ${item.name}`);
                Swal.fire({
                    icon: "warning",
                    title: "Promo Expired",
                    text: `${item.name} telah dihapus karena promo expired.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                return false;
            }

            if (promo.end_date !== item.end_date) {
                item.end_date = promo.end_date;
            }

            return true;
        });

        if (hasExpiredItems || validatedCart.length !== cart.length) {
            console.log("Updating cart after validation", {
                before: cart.length,
                after: validatedCart.length,
            });
            setCart(validatedCart);
        }
    }, [activePromos, cart, setCart, isCartOpen]);

    // Fungsi untuk membuka/tutup pop-up keranjang
    const toggleCart = () => {
        console.log("Toggling cart, current state:", isCartOpen);
        setIsCartOpen(!isCartOpen);
        if (isBranchModalOpen) setIsBranchModalOpen(false);
    };

    // Fungsi untuk membuka/tutup modal cabang
    const toggleBranchModal = () => {
        setIsBranchModalOpen(!isBranchModalOpen);
    };

    // Fungsi untuk memilih cabang
    const handleSelectBranch = (branch: Branch) => {
        const whatsappContact = branch.branch_contact.find((contact) => contact.type === "whatsapp")?.contact;
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
            .map((item) => `${item.name} (x${item.quantity}) - Rp${(item.price * item.quantity).toLocaleString()}`)
            .join("\n");

        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString();
        const totalDiscount = cart.reduce((total, item) => total + (item.discount || 0) * item.quantity, 0).toLocaleString();
        const totalToPay = cart.reduce((total, item) => total + (item.price - (item.discount || 0)) * item.quantity, 0).toLocaleString();

        return `Halo admin, saya mau pesan dari cabang ${selectedBranch?.name}:\n${itemsText}\n\nTotal: Rp${totalPrice}\nDiskon: Rp${totalDiscount}\nTotal Bayar: Rp${totalToPay}`;
    };

    // Fungsi untuk menangani klik tombol Checkout
    const handleCheckout = () => {
        if (!selectedBranch) {
            setIsBranchModalOpen(true);
            return;
        }

        const whatsappContact = selectedBranch.branch_contact.find((contact) => contact.type === "whatsapp")?.contact;
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
        <ErrorBoundary>
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
                            <h2 className="text-lg font-bold mb-4">Keranjang Belanja</h2>
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm">
                                    Cabang: {selectedBranch ? selectedBranch.name : "Belum dipilih"}
                                </p>
                                <button
                                    className="text-red-600 hover:text-red-700 text-sm underline"
                                    onClick={toggleBranchModal}
                                    aria-label="Select or change branch"
                                >
                                    {selectedBranch ? "Ganti Cabang" : "Pilih Cabang"}
                                </button>
                            </div>
                            {cart.length === 0 ? (
                                <p className="text-gray-700 text-sm">Keranjang kosong</p>
                            ) : (
                                <div>
                                    <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                        {cart.map((item) => (
                                            <li key={item.id} className="py-2 flex justify-between items-center">
                                                <div className="flex-1">
                                                    <span className="text-gray-700 text-sm">
                                                        {item.name} (x{item.quantity})
                                                    </span>
                                                    <br />
                                                    <span className="text-gray-600 text-xs">
                                                        Rp{(item.price * item.quantity).toLocaleString()}
                                                        {item.discount && item.discount > 0 && (
                                                            <span className="text-red-500 ml-1">
                                                                (Diskon: Rp{(item.discount * item.quantity).toLocaleString()})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm ml-2"
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
                                            {cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                                        </p>
                                        <p className="text-gray-700 font-bold text-red-500">
                                            Diskon: Rp
                                            {cart.reduce((total, item) => total + (item.discount || 0) * item.quantity, 0).toLocaleString()}
                                        </p>
                                        <p className="text-gray-700 font-bold text-green-600">
                                            Total Bayar: Rp
                                            {cart.reduce((total, item) => total + (item.price - (item.discount || 0)) * item.quantity, 0).toLocaleString()}
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
                                <p className="text-gray-700 text-sm">Tidak ada cabang tersedia.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
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
                        </div>
                    </div>
                )}
            </>
        </ErrorBoundary>
    );
};

export default FloatingCart;