import React from "react";
import { TextInput } from "./Textinput.jsx";
import { PrimaryButton } from "./PrimaryButton.jsx";
import { TextArea } from "./TextArea.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlaceForm } from "../hooks/usePlaceForm.js";

export default function AddPlaceModal({ open, onClose, onSaved, defaultLat, defaultLng, editPlace }) {
    const { user } = useAuth();
    const UID = user?.uid ?? "";

    const { form, saving, fileInputRef, handleChange, handleFiles, submit } = usePlaceForm({
        UID,
        onSaved,
        defaultLat,
        defaultLng,
        open,
        editPlace,
    });

    if (!open) return null;

    return (
        <div className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex overflow-y-auto overflow-x-hidden fixed inset-0 z-[9999] justify-center items-center w-full h-full">
            <div className={'w-xl bg-white rounded-md p-4'}>
                <h3 className={'text-gray-900 font-semibold mb-4 text-xl'}>{editPlace ? "Editar ubicación" : "Nueva ubicación"}</h3>

                <div className={'mb-4'}>
                    <TextInput
                        name="title"
                        label={'Titulo'}
                        value={form.title}
                        required
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
                            required
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
                            required
                            placeholder={'-73.2171831'}
                            value={form.lng}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className={'mb-4'}>
                    <TextInput
                        name="photos"
                        label={'Foto'}
                        type="file"
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
