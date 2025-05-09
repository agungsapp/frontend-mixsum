import { useRef, useState, useEffect, useContext } from "react";
import { BiPlus, BiSolidCart, BiSolidHeart, BiSolidStar } from "react-icons/bi";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Swiper, SwiperSlide } from "swiper/react";
import SampleProduk from "../assets/images/produk/1.png";
import { apiClient } from "../utils/api";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";
import { Autoplay } from "swiper/modules";

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

// Fungsi untuk menghasilkan rating acak antara 4.3 dan 4.9
const getRandomRating = () => {
    return (Math.random() * (4.9 - 4.3) + 4.3).toFixed(1);
};

// Fungsi untuk menghasilkan like acak antara 5.5K dan 11.8K
const getRandomLikes = () => {
    const likes = Math.random() * (11.8 - 5.5) + 5.5;
    return `${likes.toFixed(1)}K`;
};

// Komponen skeleton untuk kartu produk
const ProductCardSkeleton = () => (
    <div className="rounded-2xl p-6 shadow-2xl bg-white">
        <div className="mb-1 flex items-center justify-between md:mb-4">
            <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="hidden md:block -mt-20 h-40 w-40 bg-gray-300 rounded animate-pulse"></div>
            <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
            </div>
        </div>
        <div className="mb-3 flex justify-center">
            <div className="block md:hidden h-40 w-40 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col gap-3">
            <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
            <div className="flex items-center justify-between">
                <div className="h-5 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex justify-center">
                <div className="h-8 w-24 bg-gray-300 rounded-2xl animate-pulse"></div>
            </div>
        </div>
    </div>
);

const ProductRecommendation = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
        {}
    );
    const swiperRef = useRef<SwiperType | null>(null);

    // Akses CartContext
    const context = useContext(CartContext);
    if (!context) {
        throw new Error(
            "ProductRecommendation must be used within a CartProvider"
        );
    }
    const { addToCart, selectedBranch, setShowBranchModal } = context;

    const dummyProducts: ProductItem[] = [
        {
            id: 1,
            name: "DIMSUM",
            slug: "dimsum",
            description: "isi 5 pcs",
            path: "http://localhost:8000/storage/produk/1.png",
            price: "15000",
            active: 1,
            product_type_id: 1,
            created_at: "2025-05-08T02:32:26.000000Z",
            updated_at: "2025-05-08T02:32:26.000000Z",
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSlideChange = (swiper: SwiperType) => {
        setActiveIndex(swiper.realIndex);
    };

    const handleSlideClick = (index: number) => {
        if (!swiperRef.current) return;
        if (window.innerWidth < 768) {
            if (index > activeIndex) {
                swiperRef.current.slideNext();
            } else if (index < activeIndex) {
                swiperRef.current.slidePrev();
            }
        } else {
            swiperRef.current.slideToLoop(index);
        }
    };

    // Fungsi untuk menambahkan produk ke keranjang
    const handleAddToCart = (product: ProductItem) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
        });
        Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: `${product.name} telah ditambahkan ke keranjang!`,
            timer: 2000,
            showConfirmButton: false,
        });
    };

    // Fungsi untuk tombol Chat Admin
    const handleChatAdmin = (productName: string) => {
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
            `Halo, Admin, saya mau pesan ${productName} dari cabang ${selectedBranch.name}`
        );
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, "_blank");
    };

    if (isLoading) {
        return (
            <section className="relative overflow-hidden bg-gray-100 py-16">
                <div className="relative container mx-auto max-w-7xl px-0 md:px-6">
                    <h2 className="mb-10 text-center text-4xl font-bold text-black md:text-5xl">
                        <span className="me-1.5">Dimsum Paling</span>
                        <span className="relative inline-block text-red-700">
                            Best Seller
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
                    <div className="px-4">
                        <Swiper
                            effect="coverflow"
                            loop={true}
                            grabCursor={true}
                            modules={[Autoplay]}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 150,
                                modifier: 2,
                                slideShadows: false,
                            }}
                            spaceBetween={30}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                    centeredSlides: true,
                                    initialSlide: 0,
                                },
                                768: {
                                    slidesPerView: 3,
                                    centeredSlides: true,
                                    initialSlide: 1,
                                },
                            }}
                            className="mySwiper"
                        >
                            {Array.from({ length: 3 }).map((_, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="px-5 md:px-8 py-16"
                                >
                                    <ProductCardSkeleton />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden top-wave bg-gray-100 py-16">
            <div className="relative container mx-auto max-w-7xl px-0 md:px-6">
                <h2 className="mb-10 text-center text-4xl font-bold text-black md:text-5xl">
                    <span className="me-1.5">Dimsum Paling</span>
                    <span className="relative inline-block text-red-700">
                        Best Seller
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
                <div className="px-4">
                    <Swiper
                        effect="coverflow"
                        loop={true}
                        grabCursor={true}
                        modules={[Autoplay]}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 150,
                            modifier: 2,
                            slideShadows: false,
                        }}
                        spaceBetween={30}
                        onSlideChange={handleSlideChange}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                centeredSlides: true,
                                initialSlide: 0,
                            },
                            768: {
                                slidesPerView: 3,
                                centeredSlides: true,
                                initialSlide: 1,
                            },
                        }}
                        className="mySwiper"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide
                                key={product.id}
                                className="px-5 md:px-8 py-16"
                            >
                                <div
                                    className={`rounded-2xl p-6 shadow-2xl transition-transform duration-300 ${
                                        index === activeIndex
                                            ? "bg-white"
                                            : "bg-transparent"
                                    }`}
                                    onClick={() => handleSlideClick(index)}
                                >
                                    <div className="mb-1 flex items-center justify-between md:mb-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <BiSolidStar
                                                size={25}
                                                className="text-yellow-400"
                                            />
                                            <span className="text-base font-bold text-black">
                                                {getRandomRating()}
                                            </span>
                                        </div>
                                        <div className="relative -mt-20 h-40 w-40 hidden md:block">
                                            {!imageLoaded[product.id] && (
                                                <div className="absolute inset-0 bg-gray-300 rounded animate-pulse">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
                                                </div>
                                            )}
                                            <img
                                                src={
                                                    product.path ||
                                                    "/placeholder.svg"
                                                }
                                                alt={product.name}
                                                className={`h-full w-full object-cover ${
                                                    imageLoaded[product.id]
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                                onLoad={() =>
                                                    setImageLoaded((prev) => ({
                                                        ...prev,
                                                        [product.id]: true,
                                                    }))
                                                }
                                                onError={(e) => {
                                                    console.error(
                                                        `Error loading image: ${product.path}`
                                                    );
                                                    e.currentTarget.src =
                                                        SampleProduk;
                                                    setImageLoaded((prev) => ({
                                                        ...prev,
                                                        [product.id]: true,
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <BiSolidHeart
                                                size={25}
                                                className="text-red-600"
                                            />
                                            <span className="text-base font-bold text-black">
                                                {getRandomLikes()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-3 flex justify-center">
                                        <div className="relative block md:hidden h-40 w-40">
                                            {!imageLoaded[product.id] && (
                                                <div className="absolute inset-0 bg-gray-300 rounded animate-pulse">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
                                                </div>
                                            )}
                                            <img
                                                src={
                                                    product.path ||
                                                    "/placeholder.svg"
                                                }
                                                alt={product.name}
                                                className={`h-full w-full object-cover ${
                                                    imageLoaded[product.id]
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                                onLoad={() =>
                                                    setImageLoaded((prev) => ({
                                                        ...prev,
                                                        [product.id]: true,
                                                    }))
                                                }
                                                onError={(e) => {
                                                    console.error(
                                                        `Error loading image: ${product.path}`
                                                    );
                                                    e.currentTarget.src =
                                                        SampleProduk;
                                                    setImageLoaded((prev) => ({
                                                        ...prev,
                                                        [product.id]: true,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h2 className="text-lg font-bold text-black">
                                            {product.name}
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="mt-2 text-lg font-semibold text-red-800">
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
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="w-full pb-10">
                    <a
                        href="/menu"
                        className="mx-auto block w-fit rounded-2xl bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800"
                    >
                        Lihat Semua Menu
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ProductRecommendation;
