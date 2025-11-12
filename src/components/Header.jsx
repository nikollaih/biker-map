import React from "react";
import AuthButtons from "./AuthButtons.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {PrimaryButton} from "./PrimaryButton.jsx";
import {Link} from "react-router-dom";

export const Header = ({setOpen, viewUID}) => {
    const {user} = useAuth()
    const UID = user?.uid ?? "";
    return <>
        <header className={'flex justify-between p-2 bg-white align-center items-center'}>
        <a href="https://m.instagram.com/2almas1maquina" target={'_blank'} className={'flex justify-between w-46 items-center'}>
            <img src="/logo-2A1M.jpeg" alt="" className={'w-10 rounded-full'}/>
            <span className={'text-gray-900'}>@2almas1maquina</span>
        </a>

        <div className={'flex justify-between gap-4 items-center'}>
            <AuthButtons />
            {
                viewUID === UID &&
                <PrimaryButton title={'Nueva ubicación'} className={'bg-orange-600 cursor-pointer hover:bg-orange-700 rounded-sm'}
                        onClick={() => setOpen(true)} />
            }
        </div>

    </header>
        {
            (viewUID !== UID && UID) && <div className={'bg-neutral-800 flex justify-center gap-4 py-1'}>
                <span className={'text-red-500'}>Estás viendo el mapa de otra persona.</span>
                <Link to={"/"}>
                    <span className={'text-orange-500 underline'}>Ver mi mapa</span>
                </Link>
            </div>
        }
    </>
}
