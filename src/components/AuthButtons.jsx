// src/components/AuthButtons.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthButtons() {
    const { user, signInWithGoogle, signOut, initializing } = useAuth();

    if (initializing) return null;

    return (
        <div className="flex items-center gap-2">
            {user ? (
                <>
                    <span className="text-sm">Hola, {user.displayName?.split(" ")[0] || user.email}</span>
                    <button onClick={signOut} className="px-3 py-1 rounded bg-gray-900">Cerrar sesión</button>
                </>
            ) : (
                <button onClick={signInWithGoogle} className="px-3 py-1 rounded bg-blue-600 text-white">
                    Iniciar sesión (Google)
                </button>
            )}
        </div>
    );
}
