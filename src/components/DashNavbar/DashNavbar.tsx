

type UserOptionsProps = {

    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>
    animation: () => void
}


const DashNavbar: React.FC<UserOptionsProps> = ({ showAdminForm, animation }) => {

    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        showAdminForm(current => !current);

        animation();
    };



    return(

        <nav className="dashboard-nav p-2 d-flex flex-row user-select-none justify-content-between align-items-center">

            <h2 className="pt-1">LuluFlix</h2>   

            <button className="admin-nav-button" onClick={preventClosureOfMenu}></button>

        </nav>
    )
}

export default DashNavbar