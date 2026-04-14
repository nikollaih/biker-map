import { useState } from "react";
import ImageLightbox from "./ImageLightbox.jsx";
import { getCategoryById } from "../constants/categories.js";

const formatDate = (place) => {
    const raw = place.travelDate
        ? new Date(place.travelDate)
        : place.createdAt?.toDate?.() ?? new Date(place.createdAt);
    if (!raw) return null;
    return new Intl.DateTimeFormat("es", {
        day: "numeric", month: "short", year: "numeric",
        ...(place.travelDate ? { timeZone: "UTC" } : {}),
    }).format(raw);
};

export default function GalleryView({ places = [] }) {
    const [lightboxSrc, setLightboxSrc] = useState(null);

    const sorted = [...places].sort((a, b) => {
        const dateA = a.travelDate ? new Date(a.travelDate) : a.createdAt?.toDate?.() ?? new Date(a.createdAt);
        const dateB = b.travelDate ? new Date(b.travelDate) : b.createdAt?.toDate?.() ?? new Date(b.createdAt);
        return dateB - dateA;
    });

    return (
        <>
            <div className={'h-full overflow-y-auto bg-gray-50 p-4'}>
                {sorted.length === 0 ? (
                    <div className={'flex flex-col items-center justify-center h-full text-gray-400 gap-2'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={'w-12 h-12'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={'text-sm'}>Aún no hay lugares con fotos</span>
                    </div>
                ) : (
                    <div className={'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'}>
                        {sorted.map((place) => (
                            <div
                                key={place.id}
                                className={'bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'}
                            >
                                <div
                                    className={'relative overflow-hidden bg-gray-100'}
                                    style={{ aspectRatio: '1 / 1' }}
                                >
                                    {place.images?.[0] ? (
                                        <img
                                            src={place.images[0]}
                                            alt={place.title}
                                            onClick={() => setLightboxSrc(place.images[0])}
                                            className={'w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300'}
                                        />
                                    ) : (
                                        <div className={'w-full h-full flex items-center justify-center text-gray-300'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={'w-10 h-10'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className={'p-2.5 flex flex-col gap-1.5'}>
                                    <p className={'text-gray-900 font-semibold text-xs uppercase tracking-wide truncate m-0'}>{place.title}</p>
                                    {formatDate(place) && (
                                        <p className={'text-gray-400 text-xs m-0'}>{formatDate(place)}</p>
                                    )}
                                    {place.tags?.length > 0 && (
                                        <div className={'flex gap-1 flex-wrap'}>
                                            {place.tags.map((id) => {
                                                const cat = getCategoryById(id);
                                                return cat ? (
                                                    <span key={id} className={'inline-flex items-center gap-0.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs px-1.5 py-0.5 rounded-full'}>
                                                        {cat.icon} {cat.label}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {lightboxSrc && (
                <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
            )}
        </>
    );
}
