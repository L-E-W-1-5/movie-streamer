import './DashNavBar.css';



type UserOptionsProps = {

    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>
    animation: () => void
}


const DashNavbar: React.FC<UserOptionsProps> = ({ showAdminForm, animation }) => {

    const stopDevCode = false;


    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        showAdminForm(current => !current);

        animation();
    };

    const searchMedia = (e: React.ChangeEvent<HTMLInputElement>) => {

        console.log(e.target.value);
    }

    const toggleMovies = () => {

        console.log("toggle movies")
    }

    const toggleSeries = () => {

        console.log("toggle series")
    }


    return(

        <nav className="dashboard-nav p-2 d-flex flex-row user-select-none justify-content-between align-items-center">

            <h2 className="pt-1">LuluFlix</h2>   

            {stopDevCode &&
            <div className="dash-nav-tools">

                <div className="dash-nav-toggle-buttons">
                
                    <span
                    onClick={toggleMovies}
                    >
                        Movies
                    </span>

                    <span>Series</span>

                </div>

                <input
                className="dash-searchbar"
                type="text"
                onChange={searchMedia}
                placeholder="search.."
                />

            </div>
            }

            <button className="admin-nav-button" onClick={preventClosureOfMenu}></button>

        </nav>
    )
}

export default DashNavbar