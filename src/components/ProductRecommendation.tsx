import { useRef, useState } from "react";
import { BiPlus, BiSolidCart, BiSolidHeart, BiSolidStar } from "react-icons/bi";
import { Swiper as SwiperType } from "swiper"; // Import tipe Swiper
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductRecommendation = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null); // Tentukan tipe Swiper untuk swiperRef

    const loadImage = (path: string) => {
        return new URL(path, import.meta.url).href;
    };

    const products = [
        {
            id: 1,
            name: "Dimsum Medium Pack",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            image: loadImage("../assets/images/produk/1.png"),
            price: 29000,
        },
        {
            id: 2,
            name: "Dimsum Family Pack",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            image: loadImage("../assets/images/produk/2.png"),
            price: 29000,
        },
        {
            id: 3,
            name: "Dimsum Special Combo",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            image: loadImage("../assets/images/produk/3.png"),
            price: 29000,
        },
        {
            id: 4,
            name: "Dimsum Special Combo",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            image: loadImage("../assets/images/produk/3.png"),
            price: 29000,
        },
        {
            id: 5,
            name: "Dimsum Special Combo",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            image: loadImage("../assets/images/produk/3.png"),
            price: 29000,
        },
        {
            id: 6,
            name: "Dimsum Special Combo",
            description:
                "Lorem ipsum dolor sit amet consectetur. Viverra curabitur ut et pellentesque ipsum nunc pellentesque turpis risus.",
            image: loadImage("../assets/images/produk/3.png"),
            price: 29000,
        },
    ];

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
                        // modules={[EffectCoverflow]}
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
                                                4.5
                                            </span>
                                        </div>
                                        <img
                                            src={
                                                product.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={product.name}
                                            className="-mt-20 hidden h-40 object-cover md:block"
                                        />
                                        <div className="flex flex-col items-center gap-1">
                                            <BiSolidHeart
                                                size={25}
                                                className="text-red-600"
                                            />
                                            <span className="text-base font-bold text-black">
                                                4.5K
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-3 flex justify-center">
                                        <img
                                            src={
                                                product.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={product.name}
                                            className="block h-40 object-cover md:hidden"
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
                                                {product.price.toLocaleString()}
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
                    {/* Garis vertikal */}
                    <div className="mr-4 h-12 w-1 bg-red-700"></div>
                    {/* Tombol */}
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
