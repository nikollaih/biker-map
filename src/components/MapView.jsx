import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ✅ Use import URLs instead of require()
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// ✅ Fix Leaflet’s default icon paths for Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

export default function MapView({ places = [] }) {
    const center = places.length ? [places[0].lat, places[0].lng] : [4.3843286, -73.1784048];

    return (
        <MapContainer
            center={center}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lng]}>
                    <Popup>
                        <strong>{place.title}</strong>
                        <p>{place.description}</p>
                        {place.images?.length > 0 && (
                            <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                                {place.images.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={place.title}
                                        style={{ width: 120, height: "auto", borderRadius: 6 }}
                                    />
                                ))}
                            </div>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
