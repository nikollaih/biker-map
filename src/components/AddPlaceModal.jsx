import React, { useState } from "react";
import { uploadImages, savePlace } from "../services/placeService";

export default function AddPlaceModal({ open, onClose, onSaved }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [saving, setSaving] = useState(false);

    if (!open) return null;

    const handleFiles = e => setFiles(e.target.files);

    const submit = async () => {
        if (!title || !lat || !lng) {
            alert("Title and coordinates required");
            return;
        }

        setSaving(true);
        try {
            const urls = files && files.length ? await uploadImages(files) : [];
            const place = {
                title,
                description,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                images: urls,
                createdAt: new Date(),
            };
            await savePlace(place);
            onSaved();
            // reset
            setTitle(""); setDescription(""); setFiles([]); setLat(""); setLng("");
        } catch (err) {
            console.error(err);
            alert("Error saving place");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
            <div style={{ width: 520, background: "white", padding: 20, borderRadius: 8 }}>
                <h3>Add new place</h3>
                <div style={{ marginBottom: 8 }}>
                    <label>Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                    <label>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%" }} />
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                        <label>Lat</label>
                        <input value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 4.7" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Lng</label>
                        <input value={lng} onChange={e => setLng(e.target.value)} placeholder="e.g. -74.0" />
                    </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Photos</label>
                    <input type="file" multiple accept="image/*" onChange={handleFiles} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button onClick={onClose} disabled={saving}>Cancel</button>
                    <button onClick={submit} disabled={saving}>{saving ? "Saving..." : "Save place"}</button>
                </div>
            </div>
        </div>
    );
}
