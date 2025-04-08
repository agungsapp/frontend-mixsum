import { useRef, useState, useEffect } from "react";
import { BiPlus, BiSolidCart, BiSolidHeart, BiSolidStar } from "react-icons/bi";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Swiper, SwiperSlide } from "swiper/react";
import SampleProduk from "../assets/images/produk/1.png";
import { apiClient } from "../utils/api";

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
    return (Math.random() * (4.9 - 4.3) + 4.3).toFixed(1); // Random antara 4.3 - 4.9, 1 desimal
};

// Fungsi untuk menghasilkan like acak antara 5.5K dan 11.8K
const getRandomLikes = () => {
    const likes = Math.random() * (11.8 - 5.5) + 5.5; // Random antara 5.5 - 11.8
    return `${likes.toFixed(1)}K`; // Format dengan "K" dan 1 desimal
};

const ProductRecommendation = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const swiperRef = useRef<SwiperType | null>(null);

    const dummyProducts = [
        {
            id: 1,
            name: "Dimsum Medium Pack",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            path: SampleProduk,
            price: "29000",
            slug: "dimsum-medium-pack",
            active: 1,
            product_type_id: 1,
            created_at: "2025-04-08T07:16:18.000000Z",
            updated_at: "2025-04-08T07:16:18.000000Z",
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

    if (isLoading) {
        return (
            <section className="relative overflow-hidden bg-gray-100 py-16">
                <div className="relative container mx-auto max-w-7xl px-0 md:px-6">
                    <h2 className="mb-10 text-center text-4xl font-bold text-black md:text-5xl">
                        Loading...
                    </h2>
                </div>
            </section>
        );
    }

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
                                className="px-10 py-16"
                            >
                                <div
                                    className={`rounded-lg p-6 shadow-2xl transition-transform duration-300 ${
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
                                        <img
                                            src={
                                                product.path ||
                                                "/placeholder.svg"
                                            }
                                            alt={product.name}
                                            className="-mt-20 hidden h-40 object-cover md:block"
                                            onError={(e) => {
                                                console.error(
                                                    `Error loading image: ${product.path}`
                                                );
                                                e.currentTarget.src =
                                                    SampleProduk;
                                            }}
                                        />
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
                                        <img
                                            src={
                                                product.path ||
                                                "/placeholder.svg"
                                            }
                                            alt={product.name}
                                            className="block h-40 object-cover md:hidden"
                                            onError={(e) => {
                                                console.error(
                                                    `Error loading image: ${product.path}`
                                                );
                                                e.currentTarget.src =
                                                    SampleProduk;
                                            }}
                                        />
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
                                            <button className="inline-flex w-fit rounded-lg bg-red-700 p-2">
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
                </div>
                <div className="relative z-20 flex items-center justify-center rounded-xl bg-amber-400 p-4">
                    <div className="mr-4 h-12 w-1 bg-red-700"></div>
                    <a
                        href="#"
                        className="ms-auto rounded-2xl bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800"
                    >
                        Lihat Semua Menu
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ProductRecommendation;
