import { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { apiClient } from "../utils/api";
import { BiStar } from "react-icons/bi";

// Definisikan tipe untuk data form
interface TestimoniFormData {
    product_id: number;
    name: string;
    rating: number;
    comment: string;
    address: string;
    status?: string;
}

// Definisikan tipe untuk data produk dari API
interface Product {
    id: number;
    name: string;
}

// Definisikan tipe untuk opsi Select
interface SelectOption {
    value: number;
    label: string;
}

// Custom styles untuk react-select
const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: "1px solid #d1d5db",
        borderRadius: "0.5rem",
        padding: "0.25rem",
        "&:focus-within": {
            borderColor: "#b91c1c",
            boxShadow: "0 0 0 1px #b91c1c",
        },
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? "#b91c1c"
            : state.isFocused
            ? "#fee2e2"
            : "white",
        color: state.isSelected ? "white" : "black",
        "&:hover": {
            backgroundColor: "#fee2e2",
        },
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: "black",
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "#6b7280",
    }),
};

const FormTestimoni = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState<TestimoniFormData>({
        product_id: 0,
        name: "",
        rating: 0,
        comment: "",
        address: "",
        status: "pending",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [products, setProducts] = useState<SelectOption[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<SelectOption | null>(
        null
    );

    // Fetch data produk
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get<Product[]>("/product");
                const productOptions = response.data.map((product) => ({
                    value: product.id,
                    label: product.name,
                }));
                setProducts(productOptions);
            } catch (err: unknown) {
                console.error("Error fetching products:", err);
                setError("Gagal memuat data produk. Coba lagi nanti.");
            }
        };

        fetchProducts();
    }, []);

    // Toggle form visibility
    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
        setError(null);
        setSuccess(null);
        if (!isFormVisible) {
            setFormData({
                product_id: 0,
                name: "",
                rating: 0,
                comment: "",
                address: "",
                status: "pending",
            });
            setSelectedProduct(null);
        }
    };

    // Handle input change
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "product_id" ? parseInt(value) : value,
        }));
    };

    // Handle product selection
    const handleProductChange = (option: SingleValue<SelectOption>) => {
        setSelectedProduct(option);
        setFormData((prev) => ({
            ...prev,
            product_id: option ? option.value : 0,
        }));
    };

    // Handle rating selection
    const handleRatingClick = (rating: number) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await apiClient.post("/testimoni", formData);
            setSuccess(
                "Testimoni kamu berhasil dikirim! 🎉 Terima kasih atas ulasanmu!"
            );
            setFormData({
                product_id: 0,
                name: "",
                rating: 0,
                comment: "",
                address: "",
                status: "pending",
            });
            setSelectedProduct(null);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Gagal mengirim testimoni. Coba lagi.";
            setError(errorMessage);
        } finally {
            {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <section className="relative bg-gray-100 py-8">
            <div className="container mx-auto max-w-7xl px-6">
                <button
                    onClick={toggleForm}
                    className="mx-auto flex items-center gap-2 rounded-full bg-red-700 px-6 py-3 text-lg font-bold text-white hover:bg-red-800 transition-colors"
                    aria-label={
                        isFormVisible ? "Tutup Form" : "Buka Form Testimoni"
                    }
                >
                    Ayo Tinggalkan Komentar Kamu! 💬
                </button>

                {isFormVisible && (
                    <div className="mt-8 rounded-2xl border-t-2 border-l-2 border-red-700 bg-white p-6 shadow-lg">
                        <h3 className="mb-6 text-center text-2xl font-bold text-black">
                            Bagikan Pengalamanmu dengan{" "}
                            <span className="text-red-700">Mixsum Dimsum!</span>
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-bold text-black">
                                    Produk
                                </label>
                                <Select
                                    id="product-select"
                                    options={products}
                                    value={selectedProduct}
                                    onChange={handleProductChange}
                                    placeholder="Pilih produk..."
                                    isClearable
                                    isSearchable
                                    styles={customStyles}
                                    className="text-gray-700 capitalize"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-bold text-black">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="rounded-lg border border-gray-300 p-2 text-black focus:border-red-700 focus:outline-none"
                                    placeholder="Masukkan Nama Anda"
                                    required
                                    maxLength={255}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-bold text-black">
                                    Rating
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <BiStar
                                            key={star}
                                            size={24}
                                            className={`cursor-pointer transition-colors ${
                                                (hoveredRating ||
                                                    formData.rating) >= star
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                            fill="currentColor"
                                            onMouseEnter={() =>
                                                setHoveredRating(star)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredRating(0)
                                            }
                                            onClick={() =>
                                                handleRatingClick(star)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-bold text-black">
                                    Komentar
                                </label>
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    className="rounded-lg border border-gray-300 p-2 text-black focus:border-red-700 focus:outline-none"
                                    placeholder="Tulis komentar Anda..."
                                    required
                                    rows={4}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-bold text-black">
                                    Alamat
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="rounded-lg border border-gray-300 p-2 text-black focus:border-red-700 focus:outline-none"
                                    placeholder="Masukkan Alamat Anda"
                                    required
                                    maxLength={255}
                                />
                            </div>

                            {error && (
                                <p className="text-center text-sm text-red-700">
                                    {error}
                                </p>
                            )}
                            {success && (
                                <div className="mt-4 rounded-lg border-2 border-red-700 bg-red-50 p-4 text-center">
                                    <p className="text-lg font-bold text-red-700 animate-pulse">
                                        {success}
                                    </p>
                                    <p className="text-sm text-red-600">
                                        Testimoni akan muncul setelah disetujui
                                        admin! 🚀
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`mt-4 rounded-lg bg-red-700 px-6 py-2 text-lg font-bold text-white hover:bg-red-800 transition-colors ${
                                    isSubmitting
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isSubmitting
                                    ? "Mengirim..."
                                    : "Kirim Testimoni"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FormTestimoni;
