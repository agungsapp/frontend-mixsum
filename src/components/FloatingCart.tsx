import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { HiShoppingCart, HiX } from "react-icons/hi";

const FloatingCart = () => {
    const [isCartOpen, setIsCartOpen] = useState(false); // State untuk pop-up keranjang

    // Ambil nilai dari CartContext
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("FloatingCart must be used within a CartProvider");
    }

    const { cart, removeFromCart } = context;

    // Fungsi untuk membuka/tutup pop-up
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
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

        return `Halo admin, saya mau pesan:\n${itemsText}\n\nTotal: Rp${totalPrice}`;
    };

    // Fungsi untuk menangani klik tombol Checkout
    const handleCheckout = () => {
        const phoneNumber = "6285839023590"; // Nomor WA dengan kode negara
        const message = encodeURIComponent(generateWhatsAppMessage());
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
        setIsCartOpen(false); // Tutup pop-up setelah checkout
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
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
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
                        {cart.length === 0 ? (
                            <p className="text-gray-700 text-sm">
                                Keranjang kosong
                            </p>
                        ) : (
                            <div>
                                <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                    {cart.map((item, index) => (
                                        <li
                                            key={index}
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
                                                    removeFromCart(index)
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
                                        className="mt-4 w-full bg-red-700 text-white py-2 rounded-lg hover:bg-red-800 transition-colors"
                                        onClick={handleCheckout}
                                        aria-label="Checkout via WhatsApp"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingCart;
