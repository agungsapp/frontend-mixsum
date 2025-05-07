import HeroSection from "../components/HeroSection";
import ProductRecommendation from "../components/ProductRecommendation";
import Promo from "../components/Promo";
import Menu from "../components/Menu";
import Testimoni from "../components/Testimoni";
import Cabang from "../components/Cabang";
import "../Waves.css";

function Home() {
    return (
        <div className="mt-0">
            {/* Tambah margin-top agar konten tidak tertutup navbar fixed */}
            <HeroSection />
            <ProductRecommendation />
            <Promo />
            <Menu />
            <Cabang />
            <Testimoni />
        </div>
    );
}

export default Home;
