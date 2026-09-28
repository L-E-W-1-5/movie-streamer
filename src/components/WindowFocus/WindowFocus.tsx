import type { ReactNode } from "react";
import { createPortal } from 'react-dom'
import './WindowFocus.css';


type WindowFocusProps = {

    children: ReactNode;
    level: number;
}


export const WindowFocus: React.FC<WindowFocusProps> = ({ children, level }) => {


    const backgroundZ = 40 * level;

    const windowZ = 50 * level;

    return createPortal(

        <>
            <div className="background-focus" style={{zIndex: backgroundZ}}></div>          

            <div className="window-focus" style={{zIndex: windowZ}}>

                {children}

            </div>

        </>,
        document.body
    )
}

