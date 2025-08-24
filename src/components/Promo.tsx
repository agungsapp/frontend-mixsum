import { useState, useEffect, useContext } from "react";
import { BiPlus, BiSolidCart } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import Produk1 from "../assets/images/produk/1.png";
import { apiClient } from "../utils/api";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";
import Countdown from "./Countdown";

// Definisikan tipe untuk respons API promo
interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    path: string;
    price: string;
}

interface PromoProduct extends Product { }

interface Promo {
    id: number;
    type: "single" | "bundling";
    description: string;
    discount_value: string | null;
    start_date: string;
    end_date: string;
    status: string;
    product: Product | null;
    products: PromoProduct[];
}

// Komponen skeleton untuk kartu promo
const PromoCardSkeleton = () => (
    <div className="relative z-50 w-full rounded-3xl overflow-hidden border-2 border-dashed border-red-950 p-5">
        <div className="mx-auto w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="mt-5 flex flex-col gap-4">
            <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded animate-pulse"></div>
            <div className="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
            <div className="flex justify-between">
                <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-7 w-24 bg-gray-300 rounded-2xl animate-pulse"></div>
            </div>
        </div>
    </div>
);

const Promo = () => {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
    const [activeEndTime, setActiveEndTime] = useState<number>(0);

    // Akses CartContext
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("Promo must be used within a CartProvider");
    }
    const { addToCart, selectedBranch, setShowBranchModal } = context;

    // Data dummy promo sebagai fallback
    const dummyPromos: Promo[] = [
        {
            id: 1,
            type: "single",
            description: "Diskon Rp5.000 untuk Dimsum Medium Pack",
            discount_value: "5000",
            start_date: "2025-05-01 00:00:00",
            end_date: "2025-05-30 23:59:59",
            status: "Active",
            product: {
                id: 1,
                name: "Dimsum Medium Pack",
                slug: "dimsum-medium-pack",
                description: "isi 20 pcs",
                path: Produk1,
                price: "36000",
            },
            products: [],
        },
    ];

    // Fetch data promo
    useEffect(() => {
        const fetchPromos = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<Promo[]>("/promo");
                console.log("Promo API Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const validPromos = response.data
                        .filter((promo) => promo.status === "Active")
                        .map((promo) => ({
                            ...promo,
                            product: promo.product
                                ? {
                                    ...promo.product,
                                    path: promo.product.path.startsWith("http")
                                        ? promo.product.path
                                        : `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "")}/${promo.product.path.startsWith("/") ? promo.product.path.slice(1) : promo.product.path}`,
                                }
                                : null,
                            products: promo.products.map((product) => ({
                                ...product,
                                path: product.path.startsWith("http")
                                    ? product.path
                                    : `${import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "")}/${product.path.startsWith("/") ? product.path.slice(1) : product.path}`,
                            })),
                        }));

                    setPromos(validPromos);
                    if (validPromos.length > 0) {
                        setActiveEndTime(new Date(validPromos[0].end_date).getTime());
                        // Simpan ke localStorage
                        localStorage.setItem("activePromos", JSON.stringify(validPromos));
                    }
                } else {
                    console.log("No active promos found, hiding section");
                    setPromos([]);
                    localStorage.removeItem("activePromos"); // Hapus jika tidak ada promo
                }
            } catch (error) {
                console.error("Error fetching promo data:", error);
                setPromos(dummyPromos);
                setActiveEndTime(new Date(dummyPromos[0].end_date).getTime());
                localStorage.setItem("activePromos", JSON.stringify(dummyPromos)); // Simpan dummy sebagai fallback
            } finally {
                setIsLoading(false);
            }
        };

        fetchPromos();
    }, []);

    // Fungsi untuk menghitung diskon per item
    // Fungsi untuk menghitung diskon per item
    const calculateDiscountPerItem = (promo: Promo): number => {
        if (promo.discount_value) {
            const totalProducts = promo.type === "single" ? 1 : promo.products.length;
            return Number(promo.discount_value) / totalProducts;
        }
        return 0;
    };

    // Fungsi untuk menghitung harga promo
    const calculatePromoPrice = (promo: Promo): number => {
        if (promo.type === "single" && promo.product && promo.discount_value) {
            const originalPrice = Number(promo.product.price);
            const discount = Number(promo.discount_value);
            return originalPrice - discount;
        }
        if (promo.type === "bundling" && promo.discount_value) {
            const totalPrice = promo.products.reduce((sum, p) => sum + Number(p.price), 0);
            const discount = Number(promo.discount_value);
            return totalPrice - discount;
        }
        return 0;
    };

    // Fungsi untuk menambahkan produk ke keranjang
    const handleAddToCart = (promo: Promo) => {
        if (!selectedBranch) {
            setShowBranchModal(true);
            return;
        }

        const discountPerItem = calculateDiscountPerItem(promo);

        if (promo.type === "single" && promo.product) {
            addToCart({
                id: promo.product.id,
                name: promo.product.name,
                price: Number(promo.product.price),
                discount: discountPerItem,
                end_date: promo.end_date,
                promoId: promo.id, // Tambah
                quantity: 1,
            });
        } else if (promo.type === "bundling") {
            promo.products.forEach((product) => {
                addToCart({
                    id: product.id,
                    name: `${product.name} (Promo: ${promo.description})`,
                    price: Number(product.price),
                    discount: discountPerItem,
                    end_date: promo.end_date,
                    promoId: promo.id, // Tambah
                    quantity: 1,
                });
            });
        }

        Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: `Promo ${promo.description} telah ditambahkan ke keranjang!`,
            timer: 2000,
            showConfirmButton: false,
        });
    };

    // Fungsi untuk tombol Chat Admin
    const handleChatAdmin = (promo: Promo) => {
        if (!selectedBranch) {
            setShowBranchModal(true);
            return;
        }

        const whatsappContact = selectedBranch.branch_contact.find(
            (contact) => contact.type === "whatsapp"
        )?.contact;
        if (!whatsappContact) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Nomor WhatsApp untuk cabang ini tidak tersedia.",
                confirmButtonColor: "#dc2626",
            });
            return;
        }

        const phoneNumber = whatsappContact.replace(/[^0-9]/g, "");
        const message = encodeURIComponent(
            `Halo, Admin, saya mau pesan promo ${promo.description} dari cabang ${selectedBranch.name}`
        );
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
    };

    // Fungsi untuk memilih gambar produk berdasarkan jenis promo
    const getPromoImages = (promo: Promo): string[] => {
        if (promo.type === "single" && promo.product) {
            return [promo.product.path];
        }
        if (promo.type === "bundling") {
            return promo.products.slice(0, 2).map((p) => p.path); // Ambil 2 gambar pertama
        }
        return [Produk1];
    };

    // Jika tidak ada promo dan tidak loading, kembalikan null
    if (!isLoading && promos.length === 0) {
        return null;
    }

    return (
        <div className="bg-amber-200 py-12 md:py-16">
            <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 md:flex-row md:gap-36">
                {/* Bagian Kiri: Judul, Teks, Countdown */}
                <div className="flex w-full flex-col gap-5 md:w-1/2">
                    <h2 className="text-center text-3xl font-bold text-black md:text-4xl">
                        Super Deal <span className="text-red-700">Promo</span>
                    </h2>
                    <p className="text-center text-lg font-semibold text-red-950 md:text-xl">
                        Jangan lewatkan kesempatan emas untuk menikmati Mixsum
                        Dimsum favoritmu dengan diskon spesial dan bonus
                        menarik.
                    </p>
                    <p className="text-center animate-pulse transition-all duration-75 text-lg font-semibold text-red-950 md:text-xl">
                        🔥 Promo ini hanya berlaku untuk waktu terbatas! 🔥
                    </p>
                    <Countdown endTime={activeEndTime} />
                </div>

                {/* Bagian Kanan: Swiper Produk */}
                <div className="flex w-full justify-center md:w-1/2 relative">
                    {isLoading ? (
                        <Swiper
                            loop={true}
                            grabCursor={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay, Navigation]}
                            spaceBetween={30}
                            slidesPerView={1}
                            centeredSlides={true}
                            navigation={{
                                nextEl: ".promo-swiper-button-next",
                                prevEl: ".promo-swiper-button-prev",
                            }}
                            className="w-full max-w-80 md:max-w-96"
                        >
                            <SwiperSlide>
                                <PromoCardSkeleton />
                            </SwiperSlide>
                        </Swiper>
                    ) : (
                        <>
                            <div
                                className="promo-swiper-button-next absolute right-5 top-28 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-700 hover:bg-red-800"
                                aria-label="Next promo"
                            >
                                <BsArrowRight size={25} className="text-white" />
                            </div>
                            <Swiper
                                loop={true}
                                grabCursor={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                modules={[Autoplay, Navigation]}
                                spaceBetween={30}
                                slidesPerView={1}
                                centeredSlides={true}
                                navigation={{
                                    nextEl: ".promo-swiper-button-next",
                                    prevEl: ".promo-swiper-button-prev",
                                }}
                                onSlideChange={(swiper) => {
                                    setActiveEndTime(new Date(promos[swiper.realIndex].end_date).getTime());
                                }}
                                className="w-full max-w-80 md:max-w-96"
                            >
                                {promos.map((promo) => {
                                    const images = getPromoImages(promo);
                                    return (
                                        <SwiperSlide key={promo.id}>
                                            <div className="relative z-50 w-full rounded-3xl border-2 border-dashed border-red-950 p-5">
                                                <div className="flex justify-center gap-2 mx-auto">
                                                    {images.map((path, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative w-20 h-20 md:w-24 md:h-24"
                                                        >
                                                            {!imageLoaded[`${promo.id}-${index}`] && (
                                                                <div className="absolute inset-0 bg-gray-300 rounded-3xl overflow-hidden animate-pulse">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
                                                                </div>
                                                            )}
                                                            <img
                                                                src={path}
                                                                alt={`${promo.description} - product ${index + 1}`}
                                                                className={`w-full h-full object-cover rounded-lg ${imageLoaded[`${promo.id}-${index}`] ? "opacity-100" : "opacity-0"
                                                                    }`}
                                                                onLoad={() =>
                                                                    setImageLoaded((prev) => ({
                                                                        ...prev,
                                                                        [`${promo.id}-${index}`]: true,
                                                                    }))
                                                                }
                                                                onError={(e) => {
                                                                    console.error(`Error loading image: ${path}`);
                                                                    e.currentTarget.src = Produk1;
                                                                    setImageLoaded((prev) => ({
                                                                        ...prev,
                                                                        [`${promo.id}-${index}`]: true,
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-5 flex flex-col gap-4">
                                                    <h3 className="text-xl font-bold text-black md:text-2xl text-center">
                                                        {promo.type === "single" && promo.product
                                                            ? promo.product.name
                                                            : images
                                                                .map((_, index) => {
                                                                    if (promo.type === "single" && promo.product) return promo.product.name;
                                                                    const product =
                                                                        promo.products.find((p) => p.path === images[index]) ||
                                                                        (index === 0 && promo.product);
                                                                    return product ? product.name : "";
                                                                })
                                                                .filter((name) => name)
                                                                .join(" + ")}
                                                    </h3>
                                                    <p className="text-base font-medium text-red-950 md:text-xl text-center">
                                                        {promo.description}
                                                    </p>
                                                    <div className="flex justify-between font-bold text-black">
                                                        {promo.type === "single" && promo.product ? (
                                                            <>
                                                                <p className="text-base line-through md:text-lg">
                                                                    Rp {Number(promo.product.price).toLocaleString()}
                                                                </p>
                                                                <p className="text-base text-red-700 md:text-lg">
                                                                    Rp {calculatePromoPrice(promo).toLocaleString()}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-base line-through md:text-lg">
                                                                    Rp{" "}
                                                                    {promo.products
                                                                        .reduce((sum, p) => sum + Number(p.price), 0)
                                                                        .toLocaleString()}
                                                                </p>
                                                                <p className="text-base text-red-700 md:text-lg">
                                                                    Rp {calculatePromoPrice(promo).toLocaleString()}
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <button
                                                            className="bg-amber-200 text-red-600 border border-red-600 font-semibold px-3 py-1 hover:text-white hover:bg-red-600 rounded-2xl"
                                                            onClick={() => handleChatAdmin(promo)}
                                                            aria-label={`Chat admin about ${promo.description}`}
                                                        >
                                                            Chat admin
                                                        </button>
                                                        <button
                                                            className="inline-flex w-fit rounded-lg bg-red-700 p-2 hover:bg-red-800 transition-colors"
                                                            onClick={() => handleAddToCart(promo)}
                                                            aria-label={`Add promo ${promo.description} to cart`}
                                                        >
                                                            <BiPlus size={18} className="text-white" />
                                                            <BiSolidCart size={18} className="text-white" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Promo;