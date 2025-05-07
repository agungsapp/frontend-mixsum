import React, { useEffect, useState } from "react";
import { apiClient } from "../utils/api";
import DefaultHero from "../assets/images/momoyo1.png";

// Definisikan tipe untuk respons API
interface CarouselItem {
    id: number;
    keterangan: string;
    path: string;
    urutan: number;
    active: number;
    created_at: string;
    updated_at: string;
}

const HeroSection: React.FC = () => {
    const [slides, setSlides] = useState<string[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fallback slides
    const dummySlides = [
        DefaultHero,
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Crect fill='%23FF5733' width='1200' height='600'/%3E%3Ctext fill='%23FFFFFF' font-family='Arial' font-size='80' x='400' y='300'%3ESlide 2%3C/text%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Crect fill='%2333FF57' width='1200' height='600'/%3E%3Ctext fill='%23FFFFFF' font-family='Arial' font-size='80' x='400' y='300'%3ESlide 3%3C/text%3E%3C/svg%3E",
    ];

    useEffect(() => {
        const fetchCarouselData = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<CarouselItem[]>(
                    "/carousel"
                );

                console.log("API Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const validSlides = response.data
                        .filter((item) => item.active === 1 && item.path)
                        .sort((a, b) => a.urutan - b.urutan)
                        .map((item) => {
                            // Pastikan path lengkap
                            if (item.path.startsWith("http")) {
                                return item.path;
                            } else {
                                const baseUrl =
                                    import.meta.env.VITE_API_BASE_URL || "";
                                return `${baseUrl.replace(
                                    /\/api\/?$/,
                                    ""
                                )}/${item.path.replace(/^\//, "")}`;
                            }
                        });

                    console.log("Processed slides:", validSlides);

                    if (validSlides.length > 0) {
                        setSlides(validSlides);
                    } else {
                        console.log("No valid slides found, using dummy data");
                        setSlides(dummySlides);
                    }
                } else {
                    console.log("Empty API response, using dummy data");
                    setSlides(dummySlides);
                }
            } catch (error) {
                console.error("Error fetching carousel data:", error);
                setSlides(dummySlides);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCarouselData();
    }, []);

    // Atur interval untuk pergantian slide setiap 500ms
    useEffect(() => {
        if (slides.length <= 1) {
            console.log("Only one slide available, no transition needed.");
            return;
        }

        console.log(`Carousel initialized with ${slides.length} slides`);
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000); // Interval 500ms

        return () => clearInterval(interval);
    }, [slides.length]);

    if (isLoading) {
        return (
            <div className="hero-section relative flex h-[20vh] w-full items-center justify-center overflow-hidden md:h-[600px]">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="hero-section relative h-[20vh] w-full overflow-hidden md:h-[600px]">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <img
                        src={slide}
                        alt={`Slide ${index + 1}`}
                        className="h-full w-full object-cover md:object-cover"
                        onError={(e) => {
                            console.error(`Error loading image: ${slide}`);
                            e.currentTarget.src = DefaultHero;
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default HeroSection;
