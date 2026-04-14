import { useState, useRef, useCallback, useEffect } from "react";
import { uploadImage, savePlace, updatePlace, deleteImageByUrl } from "../services/placeService";
import { compressImage } from "../utils/compressImage";

const EMPTY_FORM = { title: "", description: "", lat: "", lng: "", url: "" };

export function usePlaceForm({ UID, onSaved, defaultLat, defaultLng, open, editPlace }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        if (editPlace) {
            setForm({
                title: editPlace.title ?? "",
                description: editPlace.description ?? "",
                lat: String(editPlace.lat ?? ""),
                lng: String(editPlace.lng ?? ""),
                url: editPlace.url ?? "",
            });
        } else if (defaultLat != null && defaultLng != null) {
            setForm((prev) => ({ ...prev, lat: String(defaultLat), lng: String(defaultLng) }));
        }
    }, [open, editPlace, defaultLat, defaultLng]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleFiles = useCallback((e) => {
        setFile(e.target.files?.[0] ?? null);
    }, []);

    const reset = useCallback(() => {
        setForm(EMPTY_FORM);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    }, []);

    const submit = useCallback(async () => {
        if (!form.title?.trim() || !form.lat || !form.lng) {
            alert("El titulo y las coordenadas son requeridas.");
            return;
        }
        if (!UID) {
            alert("No es posible crear el registro.");
            return;
        }

        setSaving(true);
        try {
            if (editPlace) {
                let imageUrl = editPlace.images?.[0] ?? null;

                if (file) {
                    if (imageUrl) await deleteImageByUrl(imageUrl);
                    imageUrl = await uploadImage(await compressImage(file));
                }

                await updatePlace(editPlace.id, UID, {
                    title: form.title.trim(),
                    description: form.description,
                    url: form.url,
                    lat: parseFloat(form.lat),
                    lng: parseFloat(form.lng),
                    images: imageUrl ? [imageUrl] : [],
                });
            } else {
                const imageUrl = file ? await uploadImage(await compressImage(file)) : null;
                await savePlace(
                    {
                        title: form.title.trim(),
                        description: form.description,
                        url: form.url,
                        lat: parseFloat(form.lat),
                        lng: parseFloat(form.lng),
                        images: imageUrl ? [imageUrl] : [],
                        owner: UID,
                        createdAt: new Date(),
                    },
                    UID
                );
            }
            onSaved();
            reset();
        } catch (err) {
            console.error(err);
            alert("Error al guardar la ubicación.");
        } finally {
            setSaving(false);
        }
    }, [form, file, UID, editPlace, onSaved, reset]);

    return { form, file, saving, fileInputRef, handleChange, handleFiles, reset, submit };
}
