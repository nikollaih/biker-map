import React from 'react';

export const TextInput = ({ label, name = "", onChange, className, defaultValue = '', disabled = false, children, hasError = false, ...props }) => {
    return <>
        {
            label &&
            <label htmlFor={name} className={`block mb-1 text-sm font-medium text-gray-900 ${hasError ? 'text-red-500' : ''}`}>{label}</label>
        }
        {
            <>
                <input
                    type="text"
                    name={name}
                    id={name}
                    className={"h-[43px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " + className + `${hasError ? " border-red-500" : ""}`}
                    onChange={onChange}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    { ...props }
                />
                {
                    children
                }
            </>
        }
    </>
}
