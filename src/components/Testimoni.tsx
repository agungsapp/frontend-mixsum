import { BiRightArrowAlt, BiSolidStar } from "react-icons/bi";
import "swiper/css"; // Import CSS dasar Swiper
import "swiper/css/navigation"; // Import CSS navigasi (kita akan perbaiki styling-nya)
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Profile from "../assets/images/profile/profile.jpg";

const Testimoni = () => {
    // Data dummy untuk looping 5 kali
    const testimonials = Array.from({ length: 5 }, (_, index) => ({
        id: index + 1,
        name: `Carlo Neira ${index + 1}`,
        image: Profile,
        rating: 4,
        comment:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis vero voluptates ex quaerat. Rerum, dolor!",
        location: "Rajabasa, Bandar Lampung",
        product: "Mixsum Medium Pack",
    }));

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
                        <div className="testimonial-swiper-button-next absolute right-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-700">
                            <BiRightArrowAlt size={25} className="text-white" />
                        </div>

                        {/* Swiper component */}
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={10}
                            slidesPerView={1}
                            loop={true}
                            navigation={{
                                nextEl: ".testimonial-swiper-button-next",
                                prevEl: ".testimonial-swiper-button-prev",
                            }}
                            className="testimonial-swiper w-xl"
                        >
                            {testimonials.map((testimonial) => (
                                <SwiperSlide
                                    key={testimonial.id}
                                    className="p-4"
                                >
                                    <div className="relative flex flex-col gap-4 rounded-2xl border-t-2 border-l-2 border-red-700 bg-white p-4">
                                        <div className="flex justify-start gap-2 align-baseline">
                                            <img
                                                src={testimonial.image}
                                                className="h-16 w-16 rounded-full object-cover"
                                                alt="profile"
                                            />
                                            <div className="">
                                                <p className="text-xl font-bold text-black">
                                                    {testimonial.name}
                                                </p>
                                                <div className="flex gap-1">
                                                    {Array.from(
                                                        {
                                                            length: testimonial.rating,
                                                        },
                                                        (_, i) => (
                                                            <BiSolidStar
                                                                key={i}
                                                                size={20}
                                                                className="text-yellow-400"
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
                                            {testimonial.location}
                                        </p>
                                        <span className="absolute -top-4 right-2 rounded-3xl bg-red-700 px-[10px] py-[5px] text-sm font-bold text-white">
                                            {testimonial.product}
                                        </span>
                                    </div>
                                </SwiperSlide>
                            ))}
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
