import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { deletePlace } from "../services/placeService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLongPress } from "../hooks/useLongPress.js";
import ImageLightbox from "./ImageLightbox.jsx";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

function LongPressHandler({ onLongPress }) {
    const { start, cancel } = useLongPress(onLongPress);

    useMapEvents({
        mousedown: (e) => start(e.latlng.lat, e.latlng.lng),
        mouseup: cancel,
        mousemove: cancel,
        contextmenu: cancel,
    });

    return null;
}

export default function MapView({ places = [], onDelete, onLongPress, onEdit }) {
    const { user } = useAuth();
    const UID = user?.uid;
    const center = places.length ? [places[0].lat, places[0].lng] : [4.3843286, -73.1784048];
    const [lightboxSrc, setLightboxSrc] = useState(null);

    const customIcon = useMemo(() => L.icon({
        iconUrl: '/map-marker.png',
        iconSize: [40, 50],
        iconAnchor: [24, 48],
        popupAnchor: [0, -46],
        className: 'my-custom-marker',
    }), []);

    const handleDelete = async (placeId) => {
        if (!confirm("¿Estás seguro que deseas eliminar este lugar?")) return;
        const deleted = await deletePlace(placeId, UID);
        if (deleted) onDelete();
    };

    return (
        <>
        <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                ext={'jpg'}
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {onLongPress && <LongPressHandler onLongPress={onLongPress} />}

            {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lng]} icon={customIcon}>
                    <Popup minWidth={300} maxWidth={320}>
                        <div className={'w-[300px] flex flex-col'}>

                            {/* Imagen */}
                            {place.images?.[0] && (
                                <img
                                    src={place.images[0]}
                                    alt={place.title}
                                    onClick={() => setLightboxSrc(place.images[0])}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block', borderRadius: 10, cursor: 'zoom-in' }}
                                />
                            )}

                            {/* Cuerpo */}
                            <div className={'py-3 flex flex-col gap-2'}>
                                <h3 className={'text-gray-900 font-bold text-sm uppercase tracking-wide m-0'}>{place.title}</h3>

                                {place.description && (
                                    <p className={'text-gray-600 text-sm m-0 leading-snug'}>{place.description}</p>
                                )}

                                {place?.url && (
                                    <a
                                        href={place.url}
                                        target={'_blank'}
                                        className={'inline-flex items-center gap-1 text-xs font-semibold !text-orange-600 hover:!text-orange-700 mt-1'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={'w-3 h-3'} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                        </svg>
                                        Ver enlace
                                    </a>
                                )}
                            </div>

                            {/* Acciones */}
                            {UID === place.owner && (
                                <div className={'flex border-t border-gray-100'}>
                                    <button
                                        onClick={() => onEdit(place)}
                                        className={'flex-1 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer'}
                                    >
                                        Modificar
                                    </button>
                                    <div className={'w-px bg-gray-100'} />
                                    <button
                                        onClick={() => handleDelete(place.id)}
                                        className={'flex-1 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer'}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>

        {lightboxSrc && (
            <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
        </>
    );
}
