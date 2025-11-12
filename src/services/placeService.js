// src/services/placeService.js
import {
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    doc,
    deleteDoc,
    getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload multiple files and return array of public URLs
 * @param {FileList | File[]} files
 */
export async function uploadImages(files = []) {
    const urls = [];
    for (const file of Array.from(files)) {
        const fileId = uuidv4();
        const storageRef = ref(storage, `places/${fileId}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        urls.push(url);
    }
    return urls;
}

/**
 * Save a place object to Firestore
 * place = { title, description, lat, lng, images: [url], createdAt: timestamp }
 */
export async function savePlace(place, UID) {
    const col = collection(db, `users/${UID}/places`);
    const docRef = await addDoc(col, place);
    return docRef.id;
}

/** Get all places ordered by createdAt */
export async function getPlaces(UID) {
    const q = query(collection(db, `users/${UID}/places`), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Helper: extrae la ruta dentro del bucket desde una URL de descarga:
 * Ejemplo:
 * https://firebasestorage.googleapis.com/v0/b/<bucket>/o/places%2Ffile.jpg?alt=media&token=...
 * -> places/file.jpg
 */
function pathFromDownloadUrl(url) {
    try {
        const marker = "/o/";
        const start = url.indexOf(marker);
        if (start === -1) return null;
        const after = url.substring(start + marker.length);
        const endIdx = after.indexOf("?");
        const encodedPath = endIdx === -1 ? after : after.substring(0, endIdx);
        return decodeURIComponent(encodedPath); // e.g. "places/file.jpg"
    } catch (err) {
        console.error("Error parsing storage path from url:", err);
        return null;
    }
}

/**
 * Delete a place document and (optionally) its images in Storage.
 * @param {string} placeId - Firestore document id
 * @param UID
 * @returns {Promise<boolean>} true if deleted (or throws)
 */
export async function deletePlace(placeId, UID) {
    if (!placeId) throw new Error("El identificador de la ubicación es requerido.");

    // read doc to get images (so caller doesn't have to pass them)
    const docRef = doc(db, `users/${UID}/places`, placeId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
        throw new Error(`No se ha encontrado la ubicación`);
    }

    const data = snapshot.data();
    const images = Array.isArray(data.images) ? data.images : [];

    // try to delete each image from storage (best-effort; continue on error)
    for (const imageUrl of images) {
        try {
            const path = pathFromDownloadUrl(imageUrl);
            if (!path) {
                // si no logramos extraer path, tratamos de usar la URL completa como fallback
                // (deleteObject aceptará solo path o gs:// style; este fallback suele fallar,
                //  pero lo intentamos en caso que se use una URL distinta)
                const fallbackRef = ref(storage, imageUrl);
                await deleteObject(fallbackRef);
            } else {
                const storageReference = ref(storage, path);
                await deleteObject(storageReference);
            }
        } catch (err) {
            // No detener la operación por errores al borrar imágenes,
            // solo registrar para diagnóstico.
            console.warn(`No se pudo eliminar la imagen ${imageUrl}:`, err);
        }
    }

    // Finalmente, borrar el documento de Firestore
    await deleteDoc(docRef);
    return true;
}
