import React, { useEffect, useState } from "react";
import MapView from "./components/MapView";
import AddPlaceModal from "./components/AddPlaceModal";
import { getPlaces } from "./services/placeService";
import {Header} from "./components/Header.jsx";
import {useAuth} from "./context/AuthContext.jsx";
import {useSearchParams} from "react-router-dom";

export default function App() {
    const [searchParams] = useSearchParams();
    const {user} = useAuth()
    const UID = searchParams.get("uid") || user?.uid || "1";

    const [places, setPlaces] = useState(null);
    const [open, setOpen] = useState(false);

    const load = async () => {
        const items = await getPlaces(UID);
        setPlaces(items);
    };

    useEffect(() => {
        if(UID){
            load();
        }
        else {
            setPlaces([]);
        }
    }, [UID]);

    return (
        <div className={'h-[100vh] flex flex-col w-full'}>
            <Header setOpen={setOpen} viewUID={UID} />
            <main className={'flex-1'}>
                {
                    Array.isArray(places) &&
                    <MapView
                        places={places}
                        onNewPlace={() => load()}
                        onDelete={() => load()}
                    />
                }
            </main>
            <AddPlaceModal open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); load(); }} />
        </div>
    );
}
