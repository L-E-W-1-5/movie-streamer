import './AdminMenu.css'
import MovieUploadForm from '../MovieUploadForm/MovieUploadForm';
import MovieEditForm from '../MovieEditForm/MovieEditForm';
import UserEditForm from '../UserEditForm/UserEditForm';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type MovieDownloadNew } from '../../Types/Types';
import PasswordChange from '../PasswordChange/PasswordChange';




type AdminProps = {
    adminForm: boolean;
    allMovies: MovieDownloadNew[];
    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>;
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
    logout: () => void;
}

const AdminMenu: React.FC<AdminProps> = ({ showAdminForm, setAllMovies, adminForm, allMovies, logout}) => {

    
    const [uploadForm, showUploadForm] = useState<boolean>(false);

    const [movieEditForm, showMovieEditForm] = useState<boolean>(false); 

    const [userEditForm, showUserEditForm] = useState<boolean>(false);

    const [passwordForm, showPasswordForm] = useState<boolean>(false)

    const menuRef = useRef<HTMLDivElement | null>(null);



    const handleOutsideClick = useCallback ((e: MouseEvent) => {

        if(!adminForm) return

        if(menuRef.current && !menuRef.current.contains(e.target as Node)){


            showAdminForm(false)

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

    <>

    <div ref={menuRef} className="admin-menu-container border-shadow d-flex flex-column p-2">

        
            <button className="admin-menu-button p-2" onClick={() => showUploadForm(current => !current)}>upload movie</button>
            <button className="admin-menu-button p-2" onClick={() => showMovieEditForm(current => !current)}>edit movies</button>
            <button className="admin-menu-button p-2" onClick={() => showUserEditForm(current => !current)}>edit accounts</button>
            <button className="admin-menu-button p-2" onClick={() => showPasswordForm(current => !current)}>change password</button>
            <button className="admin-menu-button p-2" onClick={logout}>logout</button>
            
        
       
        {uploadForm &&

            <MovieUploadForm setAllMovies={setAllMovies} showUploadForm={showUploadForm}/>
        }

        {movieEditForm &&
        
            <MovieEditForm allMovies={allMovies} showMovieEditForm={showMovieEditForm} setAllMovies={setAllMovies}/>
        }

        {userEditForm && 
        
            <UserEditForm showUserEditForm={showUserEditForm} userEditForm={userEditForm}/>
        }

  

    </div>

        {passwordForm &&
        
            <PasswordChange setPasswordForm={showPasswordForm}/>
        }
    </>
    )
}

export default AdminMenu