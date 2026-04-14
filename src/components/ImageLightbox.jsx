import { useEffect } from "react";

export default function ImageLightbox({ src, alt, onClose }) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 transition-colors text-white cursor-pointer"
                aria-label="Cerrar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            <img
                src={src}
                alt={alt}
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
            />
        </div>
    );
}
