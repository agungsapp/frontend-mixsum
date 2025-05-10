import { useState, useEffect } from "react";
import { apiClient } from "../utils/api";

import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BsArrowRight } from "react-icons/bs";
import { BiStar } from "react-icons/bi";

// Definisikan tipe untuk respons API testimoni
interface Testimonial {
    id: number;
    product_id: number;
    name: string;
    path: string;
    rating: number;
    comment: string;
    address: string;
    created_at: string;
    updated_at: string;
    product: {
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
    };
}

// Komponen skeleton untuk kartu testimoni
const TestimonialCardSkeleton = () => (
    <div className="relative flex flex-col gap-4 rounded-2xl border-t-2 border-l-2 border-red-700 bg-white p-4">
        <div className="flex justify-start gap-2 align-baseline">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
            </div>
            <div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                </div>
                <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-5 w-5 bg-gray-200 rounded animate-pulse relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="absolute -top-4 right-2 h-6 w-24 bg-gray-200 rounded-3xl animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
    </div>
);

const Testimoni = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Data dummy sebagai fallback minimal
    const dummyTestimonials: Testimonial[] = [
        {
            id: 1,
            product_id: 1,
            name: "Melisa",
            path: "testimoni/default.png",
            rating: 5,
            comment: "Dimsumnya enak banget, ukurannya pas dan rasanya mantap!",
            address: "Kedaton, Bandar Lampung",
            created_at: "2025-05-10T02:33:11.000000Z",
            updated_at: "2025-05-10T02:33:11.000000Z",
            product: {
                id: 1,
                name: "DIMSUM",
                slug: "dimsum",
                description: "isi 5 pcs",
                path: "produk/1.png",
                price: "15000",
                active: 1,
                product_type_id: 1,
                created_at: "2025-05-10T02:33:10.000000Z",
                updated_at: "2025-05-10T02:33:10.000000Z",
            },
        },
        {
            id: 2,
            product_id: 14,
            name: "Agustian",
            path: "testimoni/default.png",
            rating: 4,
            comment:
                "Cake Dimsumnya unik, cocok buat acara keluarga. Sausnya bikin nagih!",
            address: "Korpri, Bandar Lampung",
            created_at: "2025-05-10T02:33:11.000000Z",
            updated_at: "2025-05-10T02:33:11.000000Z",
            product: {
                id: 14,
                name: "CAKE DIMSUM",
                slug: "cake-dimsum",
                description: "isi 36 pcs dimsum varian mix",
                path: "produk/14.png",
                price: "105000",
                active: 1,
                product_type_id: 1,
                created_at: "2025-05-10T02:33:10.000000Z",
                updated_at: "2025-05-10T02:33:10.000000Z",
            },
        },
    ];

    // Fetch data testimoni
    useEffect(() => {
        const fetchTestimonials = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<Testimonial[]>(
                    "/testimoni"
                );
                console.log("Testimoni API Response:", response.data);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setTestimonials(response.data);
                } else {
                    console.log(
                        "Empty testimoni API response, using dummy data"
                    );
                    setTestimonials(dummyTestimonials);
                }
            } catch (error) {
                console.error("Error fetching testimoni data:", error);
                setTestimonials(dummyTestimonials);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <section className="relative overflow-hidden bg-gray-100 py-16">
            <div className="relative container mx-auto max-w-7xl px-6">
                <h2 className="mb-10 text-center text-4xl font-bold text-black md:text-5xl">
                    <span className="me-1.5">💬 Kata Mereka Tentang</span>
                    <span className="relative inline-block text-red-700">
                        Mixsum Dimsum!
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
                    💬
                </h2>
                <div className="mx-auto w-3/4 text-xl">
                    <p className="mb-5 text-center font-bold text-black italic">
                        Dimsum enak tuh bukan katanya, tapi buktinya! 👇
                    </p>
                    <p className="text-center font-bold text-black">
                        4.9/5 dari ribuan pelanggan puas!
                    </p>
                </div>

                <div className="mx-auto mt-5 flex w-full justify-between md:w-3/5">
                    <div className="h-20 w-2 bg-red-700"></div>
                    <div className="relative flex w-full items-center gap-2">
                        {/* Custom navigation buttons */}
                        {/* <div
                            className="testimonial-swiper-button-prev absolute left-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-700"
                            aria-label="Previous testimonial"
                        >
                            <BsArrowLeft size={25} className="text-white" />
                        </div> */}
                        <div
                            className="testimonial-swiper-button-next absolute right-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-700"
                            aria-label="Next testimonial"
                        >
                            <BsArrowRight size={25} className="text-white" />
                        </div>

                        {/* Swiper component */}
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={10}
                            slidesPerView={1}
                            loop={true}
                            navigation={{
                                nextEl: ".testimonial-swiper-button-next",
                                prevEl: ".testimonial-swiper-button-prev",
                            }}
                            className="testimonial-swiper w-xl"
                        >
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <SwiperSlide key={index} className="p-4">
                                        <TestimonialCardSkeleton />
                                    </SwiperSlide>
                                ))
                            ) : testimonials.length === 0 ? (
                                <SwiperSlide className="p-4">
                                    <p className="text-center text-black text-base font-bold">
                                        Tidak ada testimoni yang ditemukan.
                                    </p>
                                </SwiperSlide>
                            ) : (
                                testimonials.map((testimonial) => (
                                    <SwiperSlide
                                        key={testimonial.id}
                                        className="p-4"
                                    >
                                        <div className="relative flex flex-col gap-4 rounded-2xl border-t-2 border-l-2 border-red-700 bg-white p-4">
                                            <div className="flex justify-start gap-2 align-baseline">
                                                <img
                                                    src={`${testimonial.path}`}
                                                    className="h-16 w-16 rounded-full object-cover"
                                                    alt={`Profile of ${testimonial.name}`}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "/fallback-profile.jpg";
                                                    }}
                                                />
                                                <div>
                                                    <p className="text-xl font-bold text-black">
                                                        {testimonial.name}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        {Array.from(
                                                            {
                                                                length: testimonial.rating,
                                                            },
                                                            (_, i) => (
                                                                <BiStar
                                                                    key={i}
                                                                    size={20}
                                                                    className="text-yellow-400"
                                                                    fill="currentColor"
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-red-950">
                                                {testimonial.comment}
                                            </p>
                                            <p className="text-base font-bold text-slate-900">
                                                {testimonial.address}
                                            </p>
                                            <span className="absolute -top-4 right-2 rounded-3xl bg-red-700 px-[10px] py-[5px] text-sm font-bold text-white">
                                                {testimonial.product.name}
                                            </span>
                                        </div>
                                    </SwiperSlide>
                                ))
                            )}
                        </Swiper>
                    </div>
                    <div className="h-20 w-2 bg-red-700"></div>
                </div>

                <p className="mt-5 text-center text-xl font-bold text-black">
                    📢 Mau jadi bagian dari tim{" "}
                    <span className="text-red-700">#DimsumLover?</span> Yuk,
                    cobain sekarang! 🚀
                </p>
            </div>
        </section>
    );
};

export default Testimoni;
