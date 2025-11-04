import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {deletePlace} from "../services/placeService.js";
import L from "leaflet";

// ✅ Use import URLs instead of require()
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

export default function MapView({ places = [], onDelete }) {
    const center = places.length ? [places[0].lat, places[0].lng] : [4.3843286, -73.1784048];
    const {isAdmin} = useAuth()

    const onDeletePlace = async (placeId) => {
        let userConfirmation = confirm("¿Estás seguro que deseas eliminar este lugar?");

        if (userConfirmation) {
            // Code to execute if the user clicked "OK"
            const deleted = await deletePlace(placeId)
            if(deleted)
               onDelete();
        }
    }

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
                        <strong className={'text-gray-900 font-semibold text-md uppercase mb-4'}>{place.title}</strong>
                        <p className={'text-gray-700 m-0'}>{place.description}</p>

                        {
                            place?.url && (
                                <a
                                    href={place.url}
                                    target={'_blank'}
                                    className={'!text-orange-600 underline mt-4'}
                                >VER ENLACE</a>
                            )
                        }

                        {place.images?.length > 0 && (
                            <div className={'mt-4 flex gap-4 overflow-x-auto'}>
                                {place.images.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={place.title}
                                        style={{ width: 150, height: "auto", borderRadius: 6 }}
                                    />
                                ))}
                            </div>
                        )}

                        {
                            isAdmin &&
                            <div className={'mt-8'}>
                                <span onClick={() => onDeletePlace(place.id)}
                                      className={'text-red-500 cursor-pointer hover:underline'}>Eliminar</span>
                            </div>
                        }
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
