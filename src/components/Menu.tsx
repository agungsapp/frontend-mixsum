import Produk1 from "../assets/images/produk/1.png";

const Menu = () => {
    return (
        <section className="relative overflow-hidden bg-gray-100 py-16">
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
                        👉 Baru pertama kali coba? Nih, intip dulu 6 menu
                        favorit biar gak bingung! 👀 Masih penasaran? Klik
                        "Lihat Semua" buat eksplor lebih banyak! 🚀 🔥 Siap
                        bikin lidah happy? 🔥
                    </p>
                </div>

                {/* product section */}
                <div className="grid gap-10 py-10 md:grid-cols-3 md:gap-20">
                    {/* card produk */}
                    <div className="rounded-3xl bg-white p-2">
                        <div className="relative z-50 max-w-96 rounded-3xl border-2 border-dashed border-red-950 bg-white p-5">
                            <img
                                src={Produk1}
                                className="mx-auto w-32"
                                alt="dimsum"
                            />
                            <div className="mt-5 flex flex-col gap-5">
                                <h3 className="text-2xl font-bold text-black">
                                    Dimsum Medium Pack
                                </h3>
                                <p className="text-xl font-medium text-red-950">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit. Nemo veniam necessitatibus
                                    possimus repellat!
                                </p>
                                <div className="flex justify-between font-bold text-black">
                                    <p>Rp. 36.000</p>
                                    <p className="text-red-700">Rp. 36.000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* card produk */}
                    <div className="rounded-3xl bg-white p-2">
                        <div className="relative z-50 max-w-96 rounded-3xl border-2 border-dashed border-red-950 bg-white p-5">
                            <img
                                src={Produk1}
                                className="mx-auto w-32"
                                alt="dimsum"
                            />
                            <div className="mt-5 flex flex-col gap-5">
                                <h3 className="text-2xl font-bold text-black">
                                    Dimsum Medium Pack
                                </h3>
                                <p className="text-xl font-medium text-red-950">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit. Nemo veniam necessitatibus
                                    possimus repellat!
                                </p>
                                <div className="flex justify-between font-bold text-black">
                                    <p>Rp. 36.000</p>
                                    <p className="text-red-700">Rp. 36.000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* card produk */}
                    <div className="rounded-3xl bg-white p-2">
                        <div className="relative z-50 max-w-96 rounded-3xl border-2 border-dashed border-red-950 bg-white p-5">
                            <img
                                src={Produk1}
                                className="mx-auto w-32"
                                alt="dimsum"
                            />
                            <div className="mt-5 flex flex-col gap-5">
                                <h3 className="text-2xl font-bold text-black">
                                    Dimsum Medium Pack
                                </h3>
                                <p className="text-xl font-medium text-red-950">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit. Nemo veniam necessitatibus
                                    possimus repellat!
                                </p>
                                <div className="flex justify-between font-bold text-black">
                                    <p>Rp. 36.000</p>
                                    <p className="text-red-700">Rp. 36.000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 flex items-center justify-center p-4">
                    {/* Tombol */}
                    <a
                        href="#"
                        className="rounded-2xl bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800"
                    >
                        Lihat Semua Menu
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Menu;
