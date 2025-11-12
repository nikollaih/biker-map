// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

const ADMIN_EMAIL = import.meta.env.VITE_ALLOWED_EMAIL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setInitializing(false);
        });
        return () => unsub();
    }, []);

    const signInWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // onAuthStateChanged actualizará el user
        } catch (err) {
            console.error("Error signin:", err);
            throw err;
        }
    }, []);

    const signOut = useCallback(async () => {
        await firebaseSignOut(auth);
    }, []);

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOut, initializing }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
