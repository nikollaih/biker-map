import React, { useState } from "react";
import MapView from "./components/MapView";
import GalleryView from "./components/GalleryView";
import AddPlaceModal from "./components/AddPlaceModal";
import CategoryFilter from "./components/CategoryFilter.jsx";
import { Header } from "./components/Header.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useSearchParams } from "react-router-dom";
import { usePlaces } from "./hooks/usePlaces.js";

export default function App() {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const UID = searchParams.get("uid") || user?.uid || import.meta.env.VITE_DEFAULT_UID;

    const { places, reload } = usePlaces(UID);

    const [view, setView] = useState("map");
    const [open, setOpen] = useState(false);
    const [mapCoords, setMapCoords] = useState(null);
    const [editPlace, setEditPlace] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    const filteredPlaces = activeCategory
        ? (places ?? []).filter((p) => p.tags?.includes(activeCategory))
        : (places ?? []);

    const handleLongPress = (lat, lng) => {
        setMapCoords({ lat, lng });
        setOpen(true);
    };

    const handleEdit = (place) => {
        setEditPlace(place);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMapCoords(null);
        setEditPlace(null);
    };

    return (
        <div className={'h-[100vh] flex flex-col w-full'}>
            <Header
                setOpen={setOpen}
                viewUID={UID}
                placeCount={places?.length ?? 0}
                view={view}
                onViewChange={setView}
            />
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
            <main className={'flex-1 overflow-hidden'}>
                {Array.isArray(places) && (
                    view === 'map' ? (
                        <MapView
                            places={filteredPlaces}
                            onDelete={reload}
                            onLongPress={handleLongPress}
                            onEdit={handleEdit}
                        />
                    ) : (
                        <GalleryView places={filteredPlaces} />
                    )
                )}
            </main>
            <AddPlaceModal
                open={open}
                onClose={handleClose}
                onSaved={() => { handleClose(); reload(); }}
                defaultLat={mapCoords?.lat}
                defaultLng={mapCoords?.lng}
                editPlace={editPlace}
            />
        </div>
    );
}
