// import CabangContentCard from "./CabangContentCard";
import CabangMaps from "./CabangMaps";

const Cabang = () => {
    return (
        <section
            id="lokasi"
            className="relative bot-wave overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 py-24"
        >
            <div className="container mx-auto max-w-7xl mt-24 md:mt-0 px-6">
                <div className="relative text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight animate-fade-in">
                        <span className="capitalize">
                            Yuk, Pilih Cabang Mixsum
                        </span>
                        <span className="relative inline-block text-red-600 ml-2">
                            Terdekat
                            <svg
                                className="absolute left-0 w-full transition-transform duration-500 group-hover:scale-110"
                                style={{ bottom: "-12px", height: "14px" }}
                                preserveAspectRatio="none"
                                viewBox="0 0 100 15"
                            >
                                <path
                                    d="M0,1 Q50,13 100,1"
                                    stroke="#EF4444"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                        <span className="ml-3 text-3xl animate-bounce">💬</span>
                    </h2>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-30 h-1/2 -z-10"></div>
                </div>
                {/* <CabangContentCard /> */}
                <CabangMaps />
            </div>
        </section>
    );
};

export default Cabang;
