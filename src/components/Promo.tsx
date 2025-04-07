import { BiArrowToRight } from "react-icons/bi";
import Countdown from "./Countdown";
import Produk1 from "../assets/images/produk/1.png";

const Promo = () => {
    const endTime = new Date().getTime() + 1000 * 60 * 60 * 24;
    return (
        <div className="bg-[#FFFAE9] py-12 md:py-16">
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
                    <p className="text-center text-lg font-semibold text-red-950 md:text-xl">
                        🔥 Promo ini hanya berlaku untuk waktu terbatas! 🔥
                    </p>
                    <Countdown endTime={endTime} />
                </div>

                {/* Bagian Kanan: Card Produk */}
                <div className="flex w-full justify-center md:w-1/2">
                    <div className="relative z-50 w-full max-w-80 rounded-3xl border-2 border-dashed border-red-950 p-5 md:max-w-96">
                        <img
                            src={Produk1}
                            className="mx-auto w-24 md:w-32"
                            alt="dimsum"
                        />
                        <div className="mt-5 flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-black md:text-2xl">
                                Dimsum Medium Pack
                            </h3>
                            <p className="text-base font-medium text-red-950 md:text-xl">
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Nemo veniam necessitatibus
                                possimus repellat!
                            </p>
                            <div className="flex justify-between font-bold text-black">
                                <p className="text-base md:text-lg">
                                    Rp. 36.000
                                </p>
                                <p className="text-base text-red-700 md:text-lg">
                                    Rp. 36.000
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tombol Panah (Opsional) */}
            <div className="mt-6 flex justify-center">
                <BiArrowToRight size={25} className="text-black" />
            </div>
        </div>
    );
};

export default Promo;
