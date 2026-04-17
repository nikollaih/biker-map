import React from "react";
import AuthButtons from "./AuthButtons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { PrimaryButton } from "./PrimaryButton.jsx";
import { Link, useSearchParams } from "react-router-dom";
import { trackInstagramClick, trackViewChange } from "../utils/analytics.js";

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={'w-4 h-4'} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 3.293L14 7v12.414l2.293-2.293A1 1 0 0018 14V4a1 1 0 00-.293-.707z" clipRule="evenodd" />
    </svg>
);

const GalleryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={'w-4 h-4'} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={'w-5 h-5'} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const Header = ({ setOpen, viewUID, placeCount, view, onViewChange }) => {
    const [searchParams] = useSearchParams();
    const isOwner = searchParams.get("isOwner") ?? 0;
    const { user } = useAuth();
    const UID = user?.uid ?? "";

    return <>
        <header className={'bg-white border-b border-gray-100'}>
            <div className={'flex items-center justify-between px-3 py-2 gap-2'}>

                {/* Logo */}
                <a href="https://m.instagram.com/2almas1maquina" target={'_blank'} onClick={trackInstagramClick} className={'flex items-center gap-2 shrink-0'}>
                    <img src="/logo-2A1M.jpeg" alt="" className={'w-9 h-9 rounded-full object-cover'} />
                    <span className={'text-gray-900 text-sm hidden sm:block'}>@2almas1maquina</span>
                </a>

                {/* Controles */}
                <div className={'flex items-center gap-2'}>

                    {/* Badge contador */}
                    {placeCount > 0 && (
                        <div className={'flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1 shrink-0'}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={'w-3 h-3 text-orange-500'} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className={'text-orange-600 text-xs font-semibold'}>{placeCount}</span>
                        </div>
                    )}

                    {/* Toggle mapa / galería */}
                    <div className={'flex bg-gray-100 rounded-lg p-0.5'}>
                        <button
                            onClick={() => { onViewChange('map'); trackViewChange('map'); }}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                                view === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <MapIcon />
                            <span className={'hidden sm:block'}>Mapa</span>
                        </button>
                        <button
                            onClick={() => { onViewChange('gallery'); trackViewChange('gallery'); }}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                                view === 'gallery' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <GalleryIcon />
                            <span className={'hidden sm:block'}>Galería</span>
                        </button>
                    </div>

                    {isOwner && <AuthButtons />}

                    {/* Botón nueva ubicación */}
                    {viewUID === UID && (
                        <button
                            onClick={() => setOpen(true)}
                            className={'flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md px-3 py-2 text-xs font-semibold transition-colors cursor-pointer'}
                        >
                            <PlusIcon />
                            <span className={'hidden sm:block'}>Nueva ubicación</span>
                        </button>
                    )}
                </div>
            </div>
        </header>

        {(viewUID !== UID && UID) && (
            <div className={'bg-neutral-800 flex justify-center gap-4 py-1.5 px-4 text-center'}>
                <span className={'text-red-400 text-xs'}>Estás viendo el mapa de otra persona.</span>
                <Link to={"/"}><span className={'text-orange-400 text-xs underline'}>Ver mi mapa</span></Link>
            </div>
        )}
    </>;
};
