import React from "react";
import { TextInput } from "./Textinput.jsx";
import { PrimaryButton } from "./PrimaryButton.jsx";
import { TextArea } from "./TextArea.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlaceForm } from "../hooks/usePlaceForm.js";
import { useCurrentLocation } from "../hooks/useCurrentLocation.js";
import TagSelector from "./TagSelector.jsx";

export default function AddPlaceModal({ open, onClose, onSaved, defaultLat, defaultLng, editPlace }) {
    const { user } = useAuth();
    const UID = user?.uid ?? "";

    const { form, saving, fileInputRef, handleChange, handleFiles, submit, setFormField } = usePlaceForm({
        UID,
        onSaved,
        defaultLat,
        defaultLng,
        open,
        editPlace,
    });

    const { fetch: fetchLocation, loading: locating } = useCurrentLocation(({ lat, lng, title }) => {
        setFormField("lat", String(lat));
        setFormField("lng", String(lng));
        setFormField("title", title);
    });

    if (!open) return null;

    return (
        <div className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex overflow-y-auto overflow-x-hidden fixed inset-0 z-[9999] justify-center items-end sm:items-center w-full h-full">
            <div className={'w-full sm:w-xl sm:max-w-xl bg-white rounded-t-2xl sm:rounded-xl p-4 pb-safe max-h-[95dvh] overflow-y-auto'}>
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

                <button
                    type="button"
                    onClick={fetchLocation}
                    disabled={locating}
                    className={'mb-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md border border-orange-500 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={'w-4 h-4'} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {locating ? "Obteniendo ubicación..." : "Tomar ubicación actual"}
                </button>

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

                <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700 mb-2'}>
                        Categorías <span className={'text-gray-400 font-normal'}>(máx. 2)</span>
                    </label>
                    <TagSelector
                        selected={form.tags}
                        onChange={(tags) => setFormField("tags", tags)}
                    />
                </div>

                <div className={'mb-4'}>
                    <TextInput
                        name="travelDate"
                        type={'date'}
                        label={'Fecha del viaje'}
                        value={form.travelDate}
                        onChange={handleChange}
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
