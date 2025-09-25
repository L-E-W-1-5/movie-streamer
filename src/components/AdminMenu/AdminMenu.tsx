import './AdminMenu.css'
import MovieUploadForm from '../MovieUploadForm/MovieUploadForm';
import { useCallback, useEffect, useRef, useState } from 'react';

type MovieDownload = {
    id: string,
    title: string,
    url: string,
    genre: string,
};


type AdminProps = {
    adminForm: boolean;
    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>;
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownload[]>>;
}

const AdminForm: React.FC<AdminProps> = ({ showAdminForm, setAllMovies, adminForm}) => {

    const [uploadForm, showUploadForm] = useState(false)

    const menuRef = useRef<HTMLDivElement | null>(null)



    const handleOutsideClick = useCallback ((e: MouseEvent) => {
console.log(adminForm)
        if(!adminForm) return
        if(menuRef.current && !menuRef.current.contains(e.target as Node)){
            console.log('here')

            showAdminForm(false)
            console.log(adminForm)
        };

    }, [showAdminForm, adminForm])


    useEffect(() => {

        if(adminForm){

            document.addEventListener('click', handleOutsideClick);
        }else{

            document.removeEventListener('click', handleOutsideClick);
        }

        return () => {

            document.removeEventListener('click', handleOutsideClick)
        };

    }, [adminForm, handleOutsideClick])


    return (

    <div ref={menuRef} className="admin-menu-container border-shadow d-flex flex-column p-2">
        
        <button className="admin-menu-button p-2" onClick={() => showUploadForm(current => !current)}>upload movie</button>
        <button className="admin-menu-button p-2">edit movies</button>
        <button className="admin-menu-button p-2">edit accounts</button>

       
        {uploadForm &&

            <MovieUploadForm setAllMovies={setAllMovies} showUploadForm={showUploadForm}/>
        }
  

    </div>
    )
}

export default AdminForm