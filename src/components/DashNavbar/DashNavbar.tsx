

type UserOptionsProps = {

    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>
}


const DashNavbar: React.FC<UserOptionsProps> = ({ showAdminForm }) => {

    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        showAdminForm(current => !current);

    };



    return(

        <nav className="dashboard-nav p-2 d-flex flex-row justify-content-between align-items-center">

            <h2 className="pt-1">LuluFlix</h2>   

            <button className="admin-nav-button" onClick={preventClosureOfMenu}></button>

        </nav>
    )
}

export default DashNavbar