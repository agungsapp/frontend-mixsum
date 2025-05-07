import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, Icon, Marker as LeafletMarker } from "leaflet";
import Select, { StylesConfig, SingleValue } from "react-select";
import "leaflet/dist/leaflet.css"; // Impor CSS Leaflet untuk styling marker dan popup
import { SiGojek, SiShopee, SiGrab } from "react-icons/si";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

// Definisi tipe untuk data cabang
interface Branch {
    name: string;
    address: string;
    lat: number;
    lng: number;
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

// Data dummy cabang dengan koordinat dari tautan Google Maps
const branches: Branch[] = [
    {
        name: "Cabang Palembang 1",
        address: "Jl. Sudirman No.123, Palembang",
        lat: -5.3882406,
        lng: 105.2525734, // Mix Kitchen
        whatsapp: "https://wa.me/6281234567890",
        instagram: "https://instagram.com/mixsum_palembang1",
        gofood: "https://gofood.link/a/example1",
        grabfood: "https://grab.link/a/example1",
        shopeefood: "https://shopee.co.id/mixsum_palembang1",
    },
    {
        name: "Cabang Palembang 2",
        address: "Jl. Veteran No.456, Palembang",
        lat: -5.3776707,
        lng: 105.2938625, // MIXSUM DIMSUM KORPRI
        whatsapp: "https://wa.me/6281234567891",
        instagram: "https://instagram.com/mixsum_palembang2",
        gofood: "https://gofood.link/a/example2",
        grabfood: "https://grab.link/a/example2",
        shopeefood: "https://shopee.co.id/mixsum_palembang2",
    },
    {
        name: "Cabang Palembang 3",
        address: "Jl. Merdeka No.789, Palembang",
        lat: -5.3999951,
        lng: 105.2107104, // MIXSUM DIMSUM KEMILING
        whatsapp: "https://wa.me/6281234567892",
        instagram: "https://instagram.com/mixsum_palembang3",
        gofood: "https://gofood.link/a/example3",
        grabfood: "https://grab.link/a/example3",
        shopeefood: "https://shopee.co.id/mixsum_palembang3",
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
            map.setView([selectedBranch.lat, selectedBranch.lng], 15); // Pindah ke cabang dengan zoom 15
            const marker = markers.current.find(
                (m) =>
                    m &&
                    m.getLatLng().lat === selectedBranch.lat &&
                    m.getLatLng().lng === selectedBranch.lng
            );
            if (marker) {
                marker.openPopup(); // Buka popup untuk marker yang sesuai
            }
        }
    }, [selectedBranch, map, markers]);

    return null;
};

const CabangMaps: React.FC = () => {
    // State untuk cabang yang dipilih
    const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(
        null
    );

    // Referensi untuk marker
    const markersRef = React.useRef<(LeafletMarker | null)[]>(
        new Array(branches.length).fill(null)
    );

    // Pusat peta awal (rata-rata lat dan lng cabang)
    const center: LatLngExpression = [
        branches.reduce((sum, branch) => sum + branch.lat, 0) / branches.length,
        branches.reduce((sum, branch) => sum + branch.lng, 0) / branches.length,
    ];

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
                        position={[branch.lat, branch.lng]}
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
                                    {branch.lat}, {branch.lng}
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
                                <div className="w-full mt-3 border border-amber-400">
                                    <button className="bg-red-600 flex items-center gap-2 px-3 py-2 rounded-lg w-full text-white">
                                        <span className="flex items-center">
                                            <FaWhatsapp
                                                className="relative -top-[2px]"
                                                size={20}
                                            />
                                        </span>
                                        <span>Chat Admin Sekarang</span>
                                    </button>
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
