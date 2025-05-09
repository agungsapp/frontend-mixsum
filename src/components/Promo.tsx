import { useState, useEffect, useContext } from "react";
import { BiPlus, BiSolidCart } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Countdown from "./Countdown";
import Produk1 from "../assets/images/produk/1.png";
import { apiClient } from "../utils/api";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";

// Definisikan tipe untuk respons API promo
interface PromoDetails {
    id: number;
    product_id: number;
    promo_price: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

interface PromoItem {
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
    promo: PromoDetails;
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
    const [promos, setPromos] = useState<PromoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
        {}
    );

    // Akses CartContext
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("Promo must be used within a CartProvider");
    }
    const { addToCart, selectedBranch, setShowBranchModal } = context;

    // Data dummy promo sebagai fallback
    const dummyPromos: PromoItem[] = [
        {
            id: 1,
            name: "Dimsum Medium Pack",
            slug: "dimsum-medium-pack",
            description:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo veniam necessitatibus possimus repellat!",
            path: Produk1,
            price: "36000",
            active: 1,
            product_type_id: 1,
            created_at: "2025-05-08T00:00:00.000000Z",
            updated_at: "2025-05-08T00:00:00.000000Z",
            promo: {
                id: 1,
                product_id: 1,
                promo_price: 29000,
                start_date: "2025-05-01",
                end_date: "2025-05-30",
                created_at: "2025-05-08T00:00:00.000000Z",
                updated_at: "2025-05-08T00:00:00.000000Z",
            },
        },
    ];

    // Fetch data promo
    useEffect(() => {
        const fetchPromos = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<PromoItem[]>("/promo");
                console.log("Promo API Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const validPromos = response.data
                        .filter(
                            (item) =>
                                item.active === 1 &&
                                item.path &&
                                item.promo &&
                                new Date(item.promo.end_date) > new Date()
                        )
                        .map((item) => ({
                            ...item,
                            path: item.path.startsWith("http")
                                ? item.path
                                : `${import.meta.env.VITE_API_BASE_URL?.replace(
                                      /\/api\/?$/,
                                      ""
                                  )}/${item.path.replace(/^\//, "")}`,
                        }));

                    setPromos(validPromos);
                } else {
                    console.log("No active promos found, hiding section");
                    setPromos([]);
                }
            } catch (error) {
                console.error("Error fetching promo data:", error);
                setPromos(dummyPromos);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPromos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fungsi untuk menambahkan produk ke keranjang
    const handleAddToCart = (promo: PromoItem) => {
        addToCart({
            id: promo.id,
            name: promo.name,
            price: Number(promo.promo.promo_price),
            quantity: 1,
        });
        Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: `${promo.name} telah ditambahkan ke keranjang!`,
            timer: 2000,
            showConfirmButton: false,
        });
    };

    // Fungsi untuk tombol Chat Admin
    const handleChatAdmin = (promoName: string) => {
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
            `Halo, Admin, saya mau pesan ${promoName} dari cabang ${selectedBranch.name}`
        );
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
    };

    // Jika tidak ada promo dan tidak loading, kembalikan null
    if (!isLoading && promos.length === 0) {
        return null;
    }

    // Gunakan end_date dari promo pertama untuk Countdown
    const endTime =
        promos.length > 0
            ? new Date(promos[0].promo.end_date).getTime()
            : new Date().getTime() + 1000 * 60 * 60 * 24;

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
                    <Countdown endTime={endTime} />
                </div>

                {/* Bagian Kanan: Swiper Produk */}
                <div className="flex w-full justify-center md:w-1/2">
                    {isLoading ? (
                        <Swiper
                            loop={true}
                            grabCursor={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            centeredSlides={true}
                            className="w-full max-w-80 md:max-w-96"
                        >
                            <SwiperSlide>
                                <PromoCardSkeleton />
                            </SwiperSlide>
                        </Swiper>
                    ) : (
                        <Swiper
                            loop={true}
                            grabCursor={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            modules={[Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            centeredSlides={true}
                            className="w-full max-w-80 md:max-w-96"
                        >
                            {promos.map((promo) => (
                                <SwiperSlide key={promo.id}>
                                    <div className="relative z-50 w-full rounded-3xl border-2 border-dashed border-red-950 p-5">
                                        <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32">
                                            {!imageLoaded[promo.id] && (
                                                <div className="absolute inset-0 bg-gray-300 rounded-3xl overflow-hidden animate-pulse">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
                                                </div>
                                            )}
                                            <img
                                                src={promo.path || Produk1}
                                                alt={promo.name}
                                                className={`w-full h-full object-cover ${
                                                    imageLoaded[promo.id]
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                                onLoad={() =>
                                                    setImageLoaded((prev) => ({
                                                        ...prev,
                                                        [promo.id]: true,
                                                    }))
                                                }
                                                onError={(e) => {
                                                    console.error(
                                                        `Error loading image: ${promo.path}`
                                                    );
                                                    e.currentTarget.src =
                                                        Produk1;
                                                    setImageLoaded((prev) => ({
                                                        ...prev,
                                                        [promo.id]: true,
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="mt-5 flex flex-col gap-4">
                                            <h3 className="text-xl font-bold text-black md:text-2xl">
                                                {promo.name}
                                            </h3>
                                            <p className="text-base font-medium text-red-950 md:text-xl">
                                                {promo.description}
                                            </p>
                                            <div className="flex justify-between font-bold text-black">
                                                <p className="text-base line-through md:text-lg">
                                                    Rp{" "}
                                                    {Number(
                                                        promo.price
                                                    ).toLocaleString()}
                                                </p>
                                                <p className="text-base text-red-700 md:text-lg">
                                                    Rp{" "}
                                                    {Number(
                                                        promo.promo.promo_price
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <button
                                                    className="bg-amber-200 text-red-600 border border-red-600 font-semibold px-3 py-1 hover:text-white hover:bg-red-600 rounded-2xl"
                                                    onClick={() =>
                                                        handleChatAdmin(
                                                            promo.name
                                                        )
                                                    }
                                                    aria-label={`Chat admin about ${promo.name}`}
                                                >
                                                    Chat admin
                                                </button>
                                                <button
                                                    className="inline-flex w-fit rounded-lg bg-red-700 p-2 hover:bg-red-800 transition-colors"
                                                    onClick={() =>
                                                        handleAddToCart(promo)
                                                    }
                                                    aria-label={`Add ${promo.name} to cart`}
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
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Promo;
