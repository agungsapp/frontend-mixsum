import { createContext, useState, useEffect, ReactNode } from "react";

// Definisikan tipe untuk item keranjang
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

// Definisikan tipe untuk kontak cabang
interface BranchContact {
    id: number;
    branch_id: number;
    type: string;
    contact: string;
}

// Definisikan tipe untuk cabang
interface Branch {
    id: number;
    name: string;
    lat: number;
    long: number;
    branch_contact: BranchContact[];
}

// Definisikan tipe untuk CartContext
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    selectedBranch: Branch | null;
    setSelectedBranch: (branch: Branch | null) => void;
    showBranchModal: boolean;
    setShowBranchModal: (show: boolean) => void;
}

// Buat context dengan default value
export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [showBranchModal, setShowBranchModal] = useState(false);

    // Simpan cart ke localStorage saat berubah
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            console.log("Adding to cart:", item, "Current cart:", prevCart);
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                const newCart = prevCart.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
                console.log("Updated cart:", newCart);
                return newCart;
            }
            const newCart = [...prevCart, item];
            console.log("Updated cart:", newCart);
            return newCart;
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => {
            console.log(
                "Removing item with id:",
                id,
                "Current cart:",
                prevCart
            );
            const newCart = prevCart.filter((item) => item.id !== id);
            console.log("Updated cart:", newCart);
            return newCart;
        });
    };

    const updateQuantity = (id: number, quantity: number) => {
        console.log("Updating quantity for id:", id, "to:", quantity);
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            setCart((prevCart) => {
                const newCart = prevCart.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                );
                console.log("Updated cart:", newCart);
                return newCart;
            });
        }
    };

    const clearCart = () => {
        console.log("Clearing cart. Current cart:", cart);
        setCart([]);
        console.log("Cart after clearing:", []);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                selectedBranch,
                setSelectedBranch,
                showBranchModal,
                setShowBranchModal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
