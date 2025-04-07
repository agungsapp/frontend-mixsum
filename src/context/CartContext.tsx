import { createContext, useState, ReactNode } from "react";

// Definisikan tipe data untuk item keranjang
interface CartItem {
    id: number;
    name: string;
    price: number;
}

// Definisikan tipe data untuk value yang akan disediakan oleh context
interface CartContextValue {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
}

// Buat context dengan nilai default
export const CartContext = createContext<CartContextValue | undefined>(
    undefined
);

// Komponen CartProvider
export function CartProvider({ children }: { children: ReactNode }) {
    // State untuk menyimpan daftar item di keranjang
    const [cart, setCart] = useState<CartItem[]>([]);

    // Fungsi untuk menambahkan item ke keranjang
    const addToCart = (item: CartItem) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    // Fungsi untuk menghapus item dari keranjang
    const removeFromCart = (index: number) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}
