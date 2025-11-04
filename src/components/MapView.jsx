import React, {useMemo} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {deletePlace} from "../services/placeService.js";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
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

    const customIcon = useMemo(() => L.icon({
        iconUrl: '/map-marker.png', // <- reemplaza por tu imagen
        iconSize: [40, 50], // tamaño del icono en px
        iconAnchor: [24, 48], // punto del icono que apunta a la coordenada (centro inferior)
        popupAnchor: [0, -46], // donde aparece el popup relativo al anchor
        className: 'my-custom-marker' // clase para estilos adicionales si quieres
    }), []);

    return (
        <MapContainer
            center={center}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                ext={'jpg'}
                url='https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}'
            attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lng]} icon={customIcon}>
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
                                <div className={'mt-4 flex gap-4 overflow-x-auto min-w-sm'}>
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
