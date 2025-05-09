import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, Icon, Marker as LeafletMarker } from "leaflet";
import Select, { StylesConfig, SingleValue } from "react-select";
import "leaflet/dist/leaflet.css"; // Impor CSS Leaflet untuk styling marker dan popup
import { SiGojek, SiShopee, SiGrab } from "react-icons/si";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { apiClient } from "../utils/api";

// Definisi tipe untuk kontak cabang
interface BranchContact {
    id: number;
    branch_id: number;
    type: string;
    contact: string;
}

// Definisi tipe untuk data cabang dari API
interface ApiBranch {
    id: number;
    name: string;
    lat: number;
    long: number; // Menggunakan lng untuk konsistensi dengan kode asli
    branch_contact: BranchContact[];
}

// Definisi tipe untuk data cabang yang digunakan di komponen
interface Branch {
    name: string;
    address: string;
    lat: number;
    long: number;
    whatsapp: string;
    instagram: string;
    gofood: string;
    grabfood: string;
    shopeefood: string;
}

// Tipe untuk opsi react-select
interface SelectOption {
    value: Branch;
    label: string;
}

// Data dummy cabang sebagai fallback
const dummyBranches: Branch[] = [
    {
        name: "kedaton",
        address: "Jl. Sudirman No.123, Bandar Lampung",
        lat: -5.3882406,
        long: 105.2525734,
        whatsapp: "https://wa.me/6287868767807",
        instagram: "https://instagram.com/mixsum_kedaton",
        gofood: "https://gofood.link/a/yMa5Qvs",
        grabfood:
            "https://r.grab.com/g/6-20250315_153422_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-CZC2AVCDCYBDL2",
        shopeefood: "https://shopee.co.id/mixsum_kedaton",
    },
    {
        name: "korpri",
        address: "Jl. Veteran No.456, Bandar Lampung",
        lat: -5.3776707,
        long: 105.2938625,
        whatsapp: "https://wa.me/6289522282600",
        instagram: "https://instagram.com/mixsum_korpri",
        gofood: "https://gofood.link/a/GETUzLd",
        grabfood:
            "https://r.grab.com/g/6-20250315_153500_6F865A3E748B4BA096BEEDB5BE107830_MEXMPS-6-C341J233EYNENX",
        shopeefood: "https://shopee.co.id/mixsum_korpri",
    },
];

// Ikon marker kustom (lokasi merah)
const customIcon = new Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
    shadowSize: [41, 41],
});

// Komponen untuk mengatur peta saat cabang dipilih
const MapController: React.FC<{
    selectedBranch: Branch | null;
    markers: React.MutableRefObject<(LeafletMarker | null)[]>;
}> = ({ selectedBranch, markers }) => {
    const map = useMap();

    React.useEffect(() => {
        if (selectedBranch) {
            map.setView([selectedBranch.lat, selectedBranch.long], 15); // Pindah ke cabang dengan zoom 15
            const marker = markers.current.find(
                (m) =>
                    m &&
                    m.getLatLng().lat === selectedBranch.lat &&
                    m.getLatLng().long === selectedBranch.long
            );
            if (marker) {
                marker.openPopup(); // Buka popup untuk marker yang sesuai
            }
        }
    }, [selectedBranch, map, markers]);

    return null;
};

const CabangMaps: React.FC = () => {
    // State untuk cabang yang dipilih dan data cabang
    const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(
        null
    );
    const [branches, setBranches] = React.useState<Branch[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    // Referensi untuk marker
    const markersRef = React.useRef<(LeafletMarker | null)[]>(
        new Array(branches.length).fill(null)
    );

    // Fetch data cabang dari API
    React.useEffect(() => {
        const fetchBranches = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<ApiBranch[]>("/branch");
                console.log("API Branch Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    // Transformasi data API ke format Branch
                    const transformedBranches: Branch[] = response.data.map(
                        (apiBranch) => {
                            const whatsappContact =
                                apiBranch.branch_contact.find(
                                    (c) => c.type === "whatsapp"
                                );
                            const gofoodContact = apiBranch.branch_contact.find(
                                (c) => c.type === "gofood"
                            );
                            const grabfoodContact =
                                apiBranch.branch_contact.find(
                                    (c) => c.type === "grabfood"
                                );

                            return {
                                name: apiBranch.name,
                                address: `Jl. ${apiBranch.name} No.123, Bandar Lampung`, // Dummy address
                                lat: apiBranch.lat,
                                long: apiBranch.long, // Gunakan long dari API, alias ke lng
                                whatsapp: whatsappContact
                                    ? `https://wa.me/${whatsappContact.contact}`
                                    : "https://wa.me/6281234567890",
                                instagram: `https://instagram.com/mixsum_${apiBranch.name.toLowerCase()}`, // Dummy Instagram
                                gofood: gofoodContact
                                    ? gofoodContact.contact
                                    : "https://gofood.link/a/example",
                                grabfood: grabfoodContact
                                    ? grabfoodContact.contact
                                    : "https://grab.link/a/example",
                                shopeefood: `https://shopee.co.id/mixsum_${apiBranch.name.toLowerCase()}`, // Dummy ShopeeFood
                            };
                        }
                    );
                    setBranches(transformedBranches);
                    setSelectedBranch(transformedBranches[0]); // Pilih cabang pertama
                } else {
                    console.log("Empty API response, using dummy data");
                    setBranches(dummyBranches);
                    setSelectedBranch(dummyBranches[0]);
                }
            } catch (error) {
                console.error("Error fetching branch data:", error);
                setBranches(dummyBranches);
                setSelectedBranch(dummyBranches[0]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, []);

    // Perbarui referensi marker saat branches berubah
    React.useEffect(() => {
        markersRef.current = new Array(branches.length).fill(null);
    }, [branches]);

    // Pusat peta awal (rata-rata lat dan lng cabang)
    const center: LatLngExpression = branches.length
        ? [
              branches.reduce((sum, branch) => sum + branch.lat, 0) /
                  branches.length,
              branches.reduce((sum, branch) => sum + branch.long, 0) /
                  branches.length,
          ]
        : [-5.3882406, 105.2525734]; // Fallback ke koordinat kedaton

    // Opsi untuk react-select
    const options: SelectOption[] = branches.map((branch) => ({
        value: branch,
        label: branch.name,
    }));

    // Styling kustom untuk react-select dengan Tailwind CSS
    const customStyles: StylesConfig<SelectOption, false> = {
        control: (provided) => ({
            ...provided,
            borderRadius: "0.5rem",
            borderColor: "#e5e7eb",
            boxShadow: "none",
            padding: "0.25rem",
            "&:hover": {
                borderColor: "#d1d5db",
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#f3f4f6"
                : state.isFocused
                ? "#f9fafb"
                : "white",
            color: "#1f2937",
            padding: "0.5rem 1rem",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "0.5rem",
            marginTop: "0.25rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }),
    };

    if (isLoading) {
        return (
            <div className="p-5 bg-white rounded-2xl">
                <p className="text-center text-gray-700">Memuat peta...</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white rounded-2xl">
            <div className="flex flex-col mb-4">
                <label
                    htmlFor="branch-select"
                    className="mb-2 text-gray-700 font-semibold"
                >
                    Cari Nama Lokasi
                </label>
                <Select
                    id="branch-select"
                    options={options}
                    value={
                        selectedBranch
                            ? {
                                  value: selectedBranch,
                                  label: selectedBranch.name,
                              }
                            : null
                    }
                    onChange={(option: SingleValue<SelectOption>) =>
                        setSelectedBranch(option ? option.value : null)
                    }
                    placeholder="Pilih cabang..."
                    isClearable
                    isSearchable
                    styles={customStyles}
                    className="text-gray-700"
                />
            </div>

            <MapContainer
                center={center}
                zoom={12.5}
                className="w-full h-[60vh]"
                style={{ height: "60vh" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapController
                    selectedBranch={selectedBranch}
                    markers={markersRef}
                />
                {branches.map((branch, index) => (
                    <Marker
                        key={index}
                        position={[branch.lat, branch.long]}
                        icon={customIcon}
                        ref={(ref) => {
                            markersRef.current[index] = ref;
                        }}
                        eventHandlers={{
                            click: () => {
                                setSelectedBranch(branch);
                            },
                        }}
                    >
                        <Popup maxWidth={500}>
                            <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                                <h3 className="text-base font-bold text-gray-800 mb-2">
                                    {branch.name}
                                </h3>
                                <p className="text-xs text-gray-600 mb-1">
                                    <span className="font-semibold">
                                        Alamat:
                                    </span>{" "}
                                    {branch.address}
                                </p>
                                <p className="text-gray-600 text-xs mb-3">
                                    <span className="font-semibold">
                                        Koordinat:
                                    </span>{" "}
                                    {branch.lat}, {branch.long}
                                </p>
                                <div className="flex text-xs flex-wrap gap-2">
                                    <a
                                        href={branch.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-pink-500 hover:bg-pink-100 p-2 rounded transition-colors"
                                    >
                                        <FaInstagram size={15} />
                                        Instagram
                                    </a>
                                    <a
                                        href={branch.grabfood}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-green-600 hover:bg-green-100 p-2 rounded transition-colors"
                                    >
                                        <SiGrab size={20} />
                                        GrabFood
                                    </a>
                                    <a
                                        href={branch.gofood}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 rounded transition-colors"
                                    >
                                        <SiGojek size={15} />
                                        GoFood
                                    </a>
                                    <a
                                        href={branch.shopeefood}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-orange-500 hover:bg-orange-100 p-2 rounded transition-colors"
                                    >
                                        <SiShopee size={15} />
                                        ShopeeFood
                                    </a>
                                </div>
                                <div className="w-full mt-3 ">
                                    <a
                                        href={branch.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-red-600 flex items-center gap-2 px-3 py-2 rounded-lg w-full text-white"
                                    >
                                        <span className="flex items-center">
                                            <FaWhatsapp
                                                className="relative text-white -top-[2px]"
                                                size={20}
                                            />
                                        </span>
                                        <span className="text-white">
                                            Chat Admin Sekarang
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default CabangMaps;
