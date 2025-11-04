import React from "react";
import AuthButtons from "./AuthButtons.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {PrimaryButton} from "./PrimaryButton.jsx";

export const Header = ({setOpen}) => {
    const {isAdmin} = useAuth()
    return <header className={'flex justify-between p-2 bg-white'}>
        <a href="https://m.instagram.com/2almas1maquina" target={'_blank'} className={'flex justify-between w-46 items-center'}>
            <img src="/logo-2A1M.jpeg" alt="" className={'w-10 rounded-full'}/>
            <span className={'text-gray-900'}>@2almas1maquina</span>
        </a>



        <div className={'flex justify-between gap-4 items-center'}>
            <AuthButtons />
            {
                isAdmin &&
                <PrimaryButton title={'Nueva ubicación'} className={'bg-orange-600 cursor-pointer hover:bg-orange-700 rounded-sm'}
                        onClick={() => setOpen(true)} />
            }
        </div>

    </header>
}
