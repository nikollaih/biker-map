// src/services/placeService.js
import { collection, addDoc, query, orderBy, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
export async function savePlace(place) {
    const col = collection(db, "places");
    const docRef = await addDoc(col, place);
    return docRef.id;
}

/** Get all places ordered by createdAt */
export async function getPlaces() {
    const q = query(collection(db, "places"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}
