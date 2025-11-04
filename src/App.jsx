import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import AddPlaceModal from "./components/AddPlaceModal";
import { getPlaces } from "./services/placeService";
import {Header} from "./components/Header.jsx";

export default function App() {
    const [places, setPlaces] = useState(null);
    const [open, setOpen] = useState(false);

    const load = async () => {
        const items = await getPlaces();
        setPlaces(items);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className={'h-[100vh] flex flex-col w-full'}>
            <Header setOpen={setOpen} />
            <main className={'flex-1'}>
                {
                    Array.isArray(places) &&
                    <MapView places={places} onNewPlace={() => load()} onDelete={() => load()} />
                }
            </main>
            <AddPlaceModal open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); load(); }} />
        </div>
    );
}
