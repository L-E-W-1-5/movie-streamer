import './AdminMenu.css'
import MovieUploadForm from '../MovieUploadForm/MovieUploadForm';
import MovieEditForm from '../MovieEditForm/MovieEditForm';
import UserEditForm from '../UserEditForm/UserEditForm';
import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { type MovieDownloadNew } from '../../Types/Types';
import PasswordChange from '../PasswordChange/PasswordChange';
import { UserContext } from '../../UserContext';





type AdminProps = {
    adminForm: boolean;
    allMovies: MovieDownloadNew[];
    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>;
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
    logout: () => void;
}

const AdminMenu: React.FC<AdminProps> = ({ showAdminForm, setAllMovies, adminForm, allMovies, logout}) => {


    const [openForm, setOpenForm] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement | null>(null);

    const { user } = useContext(UserContext)



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


    const formOpen = (form: string, e: React.MouseEvent) => {

        e.stopPropagation();

        switch(form){

            case 'users':   
                setOpenForm('users');
            break;
            
            case 'upload':               
                setOpenForm('upload');
            break;

            case 'movie':
                setOpenForm('movie');
            break;

            case 'password':
                setOpenForm('password');
            break;
        }
    }

   


    return (

    <>

    <div ref={menuRef} className="admin-menu-container border-shadow d-flex flex-column p-2">

        {user?.admin && 
            <>
                <button className="admin-menu-button p-2" onClick={(e) => formOpen('upload', e)}>upload movie</button>
                <button className="admin-menu-button p-2" onClick={(e) => formOpen('movie', e)}>edit movies</button>
                <button className="admin-menu-button p-2" onClick={(e) => formOpen('users', e)}>edit accounts</button>
            </>
        }

            <button className="admin-menu-button p-2" onClick={(e) => formOpen('password', e)}>change password</button>
            <button className="admin-menu-button p-2" onClick={logout}>logout</button>
            
        
       
        {openForm === 'upload' &&

            <MovieUploadForm setOpenForm={setOpenForm} setAllMovies={setAllMovies}/>
        }

        {openForm === 'movie' &&
        
            <MovieEditForm setOpenForm={setOpenForm} allMovies={allMovies} setAllMovies={setAllMovies}/>
        }

        {openForm === 'users' && 
        
            <UserEditForm openForm={openForm} setOpenForm={setOpenForm}/>
        }

  

    </div>

        {openForm === 'password' &&
        
            <PasswordChange setOpenForm={setOpenForm}/>
        }
    </>
    )
}

export default AdminMenu