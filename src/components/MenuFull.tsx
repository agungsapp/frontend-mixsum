import { useState, useEffect, useContext } from "react";
import { BiPlus, BiSolidCart, BiSearch } from "react-icons/bi";
import Produk1 from "../assets/images/produk/1.png";
import { apiClient } from "../utils/api";
import { CartContext } from "../context/CartContext";

// Definisikan tipe untuk respons API produk
interface ProductItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    path: string;
    price: string;
    active: number;
    product_type_id: number;
    created_at: string;
    updated_at: string;
}

const MenuFull = () => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "food" | "drink">("all");
    const [sortMode, setSortMode] = useState<"lowest" | "highest" | null>(null);

    // Akses CartContext
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("MenuFull must be used within a CartProvider");
    }

    const { addToCart } = context;

    // Data dummy sebagai fallback
    const dummyProducts = [
        {
            id: 1,
            name: "Dimsum Medium Pack",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            path: Produk1,
            price: "29000",
            slug: "dimsum-medium-pack",
            active: 1,
            product_type_id: 1,
            created_at: "2025-05-07T02:30:13.000000Z",
            updated_at: "2025-05-07T02:30:13.000000Z",
        },
        {
            id: 2,
            name: "Dimsum Family Pack",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            path: Produk1,
            price: "29000",
            slug: "dimsum-family-pack",
            active: 1,
            product_type_id: 1,
            created_at: "2025-05-07T02:30:13.000000Z",
            updated_at: "2025-05-07T02:30:13.000000Z",
        },
        {
            id: 3,
            name: "Es Teh Manis",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            path: Produk1,
            price: "10000",
            slug: "es-teh-manis",
            active: 1,
            product_type_id: 2,
            created_at: "2025-05-07T02:30:13.000000Z",
            updated_at: "2025-05-07T02:30:13.000000Z",
        },
    ];

    useEffect(() => {
        const fetchProductData = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<ProductItem[]>("/product");

                console.log("API Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const validProducts = response.data
                        .filter((item) => item.active === 1 && item.path)
                        .map((item) => ({
                            ...item,
                            path: item.path.startsWith("http")
                                ? item.path
                                : `${import.meta.env.VITE_API_BASE_URL?.replace(
                                      /\/api\/?$/,
                                      ""
                                  )}/${item.path.replace(/^\//, "")}`,
                        }));

                    console.log("Processed products:", validProducts);

                    if (validProducts.length > 0) {
                        setProducts(validProducts);
                    } else {
                        console.log(
                            "No valid products found, using dummy data"
                        );
                        setProducts(dummyProducts);
                    }
                } else {
                    console.log("Empty API response, using dummy data");
                    setProducts(dummyProducts);
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
                setProducts(dummyProducts);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, []);

    // Fungsi untuk menambahkan produk ke keranjang
    const handleAddToCart = (product: ProductItem) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
        });
        alert(`${product.name} telah ditambahkan ke keranjang!`);
    };

    // Fungsi untuk tombol Chat Admin
    const handleChatAdmin = (productName: string) => {
        const phoneNumber = "6285839023590"; // Nomor WA dengan kode negara
        const message = encodeURIComponent(
            `Hallo, Admin, saya mau pesan ${productName}`
        );
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
    };

    // Fungsi untuk memfilter dan mengurutkan produk
    const filteredAndSortedProducts = () => {
        let filteredProducts = products;

        // Filter berdasarkan tab
        if (activeTab === "food") {
            filteredProducts = products.filter(
                (product) => product.product_type_id === 1
            );
        } else if (activeTab === "drink") {
            filteredProducts = products.filter(
                (product) => product.product_type_id === 2
            );
        }

        // Filter berdasarkan pencarian
        if (searchQuery) {
            filteredProducts = filteredProducts.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Urutkan berdasarkan harga
        if (sortMode) {
            filteredProducts = [...filteredProducts].sort((a, b) => {
                const priceA = Number(a.price);
                const priceB = Number(b.price);
                return sortMode === "lowest"
                    ? priceA - priceB
                    : priceB - priceA;
            });
        }

        return filteredProducts;
    };

    if (isLoading) {
        return (
            <section className="relative overflow-hidden py-16">
                <div className="relative container mx-auto max-w-7xl px-6">
                    <h2 className="mb-10 text-center text-4xl font-bold text-black md:text-5xl">
                        Loading...
                    </h2>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden py-16">
            <div className="relative container mx-auto max-w-7xl px-6">
                <h2 className="mb-10 text-center text-4xl font-bold text-black md:text-5xl">
                    <span className="me-1.5">Pilihan Dimsum</span>
                    <span className="relative inline-block text-red-700">
                        Favorit !
                        <svg
                            className="absolute left-0 w-full"
                            style={{ bottom: "-20px", height: "15px" }}
                            preserveAspectRatio="none"
                            viewBox="0 0 100 15"
                        >
                            <path
                                d="M0,1 Q50,13 100,1"
                                stroke="#EF4444"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                </h2>
                <div className="mx-auto w-3/4 text-base md:text-xl">
                    <p className="mb-5 text-center font-bold text-black italic">
                        Dari yang crunchy sampai yang juicy, semuanya ada di
                        sini! 🤩
                    </p>
                    <p className="text-center font-bold text-black">
                        👉 Baru pertama kali coba? Nih, intip dulu menu favorit
                        biar gak bingung! 👀 Eksplor semua menu lezat kami! 🚀
                        🔥 Siap bikin lidah happy? 🔥
                    </p>
                </div>

                {/* Filter Section: Searchbar, Tabs, and Sort */}
                <div className="mt-16 flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    {/* Searchbar */}
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Cari menu favoritmu..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-700 transition-all duration-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <BiSearch
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                                activeTab === "all"
                                    ? "bg-red-700 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            Semua
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                                activeTab === "food"
                                    ? "bg-red-700 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveTab("food")}
                        >
                            Makanan
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                                activeTab === "drink"
                                    ? "bg-red-700 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setActiveTab("drink")}
                        >
                            Minuman
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-700 font-semibold cursor-pointer transition-all duration-300"
                            value={sortMode || ""}
                            onChange={(e) =>
                                setSortMode(
                                    e.target.value as "lowest" | "highest" | ""
                                )
                            }
                        >
                            <option value="">Urutkan Harga</option>
                            <option value="lowest">Harga Terendah</option>
                            <option value="highest">Harga Tertinggi</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Product Section */}
                <div className="grid gap-10 py-10 md:grid-cols-3 md:gap-20">
                    {filteredAndSortedProducts().length === 0 ? (
                        <p className="text-center text-gray-700 col-span-3">
                            Tidak ada produk yang ditemukan.
                        </p>
                    ) : (
                        filteredAndSortedProducts().map((product) => (
                            <div
                                key={product.id}
                                className="rounded-3xl bg-white p-2"
                            >
                                <div className="relative z-50 max-w-96 rounded-3xl border-2 border-dashed border-red-950 bg-white p-5">
                                    <img
                                        src={product.path || Produk1}
                                        className="mx-auto w-32"
                                        alt={product.name}
                                        onError={(e) => {
                                            console.error(
                                                `Error loading image: ${product.path}`
                                            );
                                            e.currentTarget.src = Produk1;
                                        }}
                                    />
                                    <div className="mt-5 flex flex-col gap-5">
                                        <h3 className="text-2xl font-bold text-black">
                                            {product.name}
                                        </h3>
                                        <p className="text-xl font-medium text-red-950">
                                            {product.description}
                                        </p>
                                        <div className="flex justify-between font-bold text-black">
                                            <p className="text-red-700">
                                                Rp{" "}
                                                {Number(
                                                    product.price
                                                ).toLocaleString()}
                                            </p>
                                            <button
                                                className="inline-flex w-fit rounded-lg bg-red-700 p-2 hover:bg-red-800 transition-colors"
                                                onClick={() =>
                                                    handleAddToCart(product)
                                                }
                                                aria-label={`Add ${product.name} to cart`}
                                            >
                                                <BiPlus
                                                    size={18}
                                                    className="text-white"
                                                />
                                                <BiSolidCart
                                                    size={18}
                                                    className="text-white"
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="bg-white text-red-600 border border-red-600 font-semibold px-3 py-1 hover:text-white hover:bg-red-600 rounded-2xl"
                                                onClick={() =>
                                                    handleChatAdmin(
                                                        product.name
                                                    )
                                                }
                                                aria-label={`Chat admin about ${product.name}`}
                                            >
                                                Chat admin
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default MenuFull;
