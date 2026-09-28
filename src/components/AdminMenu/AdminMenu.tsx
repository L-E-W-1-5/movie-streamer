import './AdminMenu.css'
import MovieUploadForm from '../MovieUploadForm/MovieUploadForm';
import MovieEditForm from '../MovieEditForm/MovieEditForm';
import UserEditForm from '../UserEditForm/UserEditForm';
import SeriesCreationForm from '../SeriesCreationForm/SeriesCreationForm';
import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { type MovieDownloadNew, type Series } from '../../Types/Types';
import PasswordChange from '../PasswordChange/PasswordChange';
import { UserContext } from '../../UserContext';
import { WindowFocus } from '../WindowFocus/WindowFocus';





type AdminProps = {
    adminForm: boolean;
    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>;
    allMovies: MovieDownloadNew[];
    setAllMovies: React.Dispatch<React.SetStateAction<MovieDownloadNew[]>>;
    allSeries: Series[];
    setAllSeries: React.Dispatch<React.SetStateAction<Series[]>>
    logout: () => void;
    
}

const AdminMenu: React.FC<AdminProps> = ({ showAdminForm, setAllMovies, allSeries, setAllSeries, adminForm, allMovies, logout}) => {


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

            case 'series':
                setOpenForm('series');
            break;
        }
    }

   


    return (

    <>

        <div ref={menuRef} 
        id={adminForm ? "admin-menu-open" : "admin-menu-closed"}
        className="admin-menu-container d-flex flex-column p-2"
        
        >

            {user?.admin && 
                <>
                    <button className="admin-menu-button p-2" onClick={(e) => formOpen('upload', e)}>upload movie</button>
                    <button className="admin-menu-button p-2" onClick={(e) => formOpen('series', e)}>create series</button>
                    <button className="admin-menu-button p-2" onClick={(e) => formOpen('movie', e)}>edit movies</button>
                    <button className="admin-menu-button p-2" onClick={(e) => formOpen('users', e)}>edit accounts</button>
                </>
            }

            <button className="admin-menu-button p-2" onClick={(e) => formOpen('password', e)}>change password</button>

            <button className="admin-menu-button p-2" onClick={logout}>logout</button>
            
        
       
            {openForm === 'upload' &&

                <WindowFocus level={1}>

                    <MovieUploadForm setOpenForm={setOpenForm} setAllMovies={setAllMovies} series={allSeries} setAllSeries={setAllSeries}/> 
        
                </WindowFocus>
            }

            {openForm === 'series' && 

                <WindowFocus level={1}>
        
                    <SeriesCreationForm setOpenForm={setOpenForm} setAllSeries={setAllSeries}/>

                </WindowFocus>
            }

            {openForm === 'movie' &&

                <WindowFocus level={1}>
        
                    <MovieEditForm setOpenForm={setOpenForm} allMovies={allMovies} setAllMovies={setAllMovies} allSeries={allSeries} setAllSeries={setAllSeries}/>
        
                </WindowFocus>
            }

            {openForm === 'users' &&
        
                <WindowFocus level={1}>
        
                    <UserEditForm openForm={openForm} setOpenForm={setOpenForm}/>

                </WindowFocus>
            }

            {openForm === 'password' &&

                <WindowFocus level={1}>
        
                    <PasswordChange setOpenForm={setOpenForm}/>
        
                </WindowFocus>
            }

        </div>

        
    </>
    )
}

export default AdminMenu