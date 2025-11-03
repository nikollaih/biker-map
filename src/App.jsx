import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import AddPlaceModal from "./components/AddPlaceModal";
import { getPlaces } from "./services/placeService";

export default function App() {
    const [places, setPlaces] = useState([]);
    const [open, setOpen] = useState(false);

    const load = async () => {
        const items = await getPlaces();
        setPlaces(items);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", width: '100vh', minWidth: "100vh" }}>
            <header style={{ padding: 12, background: "#111827", color: "white", display: "flex", justifyContent: "space-between" }}>
                <div>
                    <button onClick={() => setOpen(true)} style={{ padding: "8px 12px" }}>Add place</button>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                <MapView places={places} onNewPlace={() => load()} />
            </main>

            <AddPlaceModal open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); load(); }} />
        </div>
    );
}
