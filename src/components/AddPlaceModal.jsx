import React, { useState, useRef, useCallback } from "react";
import { uploadImages, savePlace } from "../services/placeService";
import { TextInput } from "./Textinput.jsx";
import { PrimaryButton } from "./PrimaryButton.jsx";
import { TextArea } from "./TextArea.jsx";

export default function AddPlaceModal({ open, onClose, onSaved }) {
    // agrupo la mayor parte del formulario en un solo estado
    const [form, setForm] = useState({
        title: "",
        description: "",
        lat: "",
        lng: "",
        url: ""
    });

    // FileList se maneja por separado y mantenemos una ref al input para resetearlo
    const [files, setFiles] = useState(null);
    const fileInputRef = useRef(null);

    const [saving, setSaving] = useState(false);

    // handlers
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleFiles = useCallback((e) => {
        setFiles(e.target.files && e.target.files.length ? e.target.files : null);
    }, []);

    const resetForm = useCallback(() => {
        setForm({
            title: "",
            description: "",
            lat: "",
            lng: "",
            url: ""
        });
        setFiles(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    }, []);

    const submit = useCallback(async () => {
        const titleTrim = form.title?.trim();
        if (!titleTrim || !form.lat || !form.lng) {
            alert("El titulo y las coordenadas son requeridas.");
            return;
        }

        setSaving(true);
        try {
            const urls = files && files.length ? await uploadImages(files) : [];
            const place = {
                title: titleTrim,
                description: form.description,
                url: form.url,
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                images: urls,
                createdAt: new Date()
            };
            await savePlace(place);
            onSaved();
            // reset campos
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Error al guardar la ubicación.");
        } finally {
            setSaving(false);
        }
    }, [form, files, onSaved, resetForm]);

    if (!open) return null;

    return (
        <div className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex overflow-y-auto overflow-x-hidden fixed inset-0 z-[9999] justify-center items-center w-full h-full">
            <div className={'w-xl bg-white rounded-md p-4'}>
                <h3 className={'text-gray-900 font-semibold mb-4 text-xl'}>Nueva ubicación</h3>

                <div className={'mb-4'}>
                    <TextInput
                        name="title"
                        label={'Titulo'}
                        value={form.title}
                        required={true}
                        placeholder={'Viaje al oriente'}
                        onChange={handleChange}
                    />
                </div>

                <div className={'mb-4'}>
                    <TextArea
                        name="description"
                        label={'Descripción'}
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <div className={'mb-4 flex gap-4'}>
                    <div className={'flex-1'}>
                        <TextInput
                            name="lat"
                            type={'number'}
                            label={'Latitud'}
                            required={true}
                            placeholder={'4.4726263'}
                            value={form.lat}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={'flex-1'}>
                        <TextInput
                            name="lng"
                            type={'number'}
                            label={'Longitud'}
                            required={true}
                            placeholder={'-73.2171831'}
                            value={form.lng}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={'mb-4'}>
                    <TextInput
                        name="photos"
                        label={'Fotos'}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFiles}
                        ref={fileInputRef}
                    />
                </div>

                <div className={'mb-5'}>
                    <TextInput
                        name="url"
                        type={'url'}
                        label={'URL'}
                        value={form.url}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <PrimaryButton className={'!bg-gray-900'} onClick={onClose} disabled={saving} title={'Cancelar'} />
                    <PrimaryButton onClick={submit} disabled={saving} title={saving ? "Guardando..." : "Guardar"} />
                </div>
            </div>
        </div>
    );
}
