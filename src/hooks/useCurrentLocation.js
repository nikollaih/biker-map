import { useState } from "react";

async function reverseGeocode(lat, lng) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
        { headers: { "Accept-Language": "es" } }
    );
    if (!res.ok) throw new Error("Error al obtener la ubicación.");
    const data = await res.json();

    const addr = data.address ?? {};
    const municipality =
        addr.city || addr.town || addr.municipality || addr.village || addr.county || "";
    const department = addr.state ?? "";

    const title = [municipality, department].filter(Boolean).join(" - ");
    return title;
}

export function useCurrentLocation(onResult) {
    const [loading, setLoading] = useState(false);

    const fetch = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const title = await reverseGeocode(coords.latitude, coords.longitude);
                    onResult({ lat: coords.latitude, lng: coords.longitude, title });
                } catch {
                    alert("No se pudo obtener el nombre del lugar.");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                alert("No se pudo acceder a tu ubicación.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return { fetch, loading };
}
