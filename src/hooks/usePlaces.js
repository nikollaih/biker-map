import { useState, useEffect } from "react";
import { getPlaces } from "../services/placeService";

export function usePlaces(UID) {
    const [places, setPlaces] = useState(null);

    const reload = async () => {
        const items = await getPlaces(UID);
        setPlaces(items);
    };

    useEffect(() => {
        if (UID) reload();
        else setPlaces([]);
    }, [UID]);

    return { places, reload };
}
