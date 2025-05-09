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
            <div id="hero">
                <HeroSection />
            </div>
            <div id="recommendation">
                <ProductRecommendation />
            </div>
            <div id="promo">
                <Promo />
            </div>
            <div id="menu">
                <Menu />
            </div>
            <div id="cabang">
                <Cabang />
            </div>
            <div id="testimoni">
                <Testimoni />
            </div>
        </div>
    );
}

export default Home;
