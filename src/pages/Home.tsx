import HeroSection from "../components/HeroSection";
import ProductRecommendation from "../components/ProductRecommendation";
import Promo from "../components/Promo";
import Menu from "../components/Menu";
import Testimoni from "../components/Testimoni";

function Home() {
    return (
        <div className="mt-0">
            {/* Tambah margin-top agar konten tidak tertutup navbar fixed */}
            <HeroSection />
            <ProductRecommendation />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                className="relative right-0 left-0 z-10 -mt-80 hidden md:block"
            >
                <path
                    fill="#FFFAE9"
                    fillOpacity="1"
                    d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,176C672,192,768,256,864,256C960,256,1056,192,1152,149.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
            </svg>
            <Promo />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                className="relative right-0 left-0 z-0 hidden md:block"
            >
                <path
                    fill="#FFFAE9"
                    fillOpacity="1"
                    d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,176C672,192,768,256,864,256C960,256,1056,192,1152,149.3C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                ></path>
            </svg>
            <Menu />
            <Testimoni />
        </div>
    );
}

export default Home;
