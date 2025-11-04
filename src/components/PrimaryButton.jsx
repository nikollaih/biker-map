import React from 'react';

export const PrimaryButton = ({title, className, disabled = false, icon = null, type = 'submit', ...props}) => {

    return <button type={type}
                   disabled={disabled}
                   className={`font-light max-w-[250px] cursor-pointer text-white hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-md px-5 py-1 text-center ` + (className) + ` ${disabled ? '!bg-gray-500 !hover:bg-gray-600 !cursor-not-allowed' : 'bg-orange-600'}`} {...props}>
        {icon}
        {title}
    </button>
}
