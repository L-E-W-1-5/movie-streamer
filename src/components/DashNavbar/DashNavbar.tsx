import { useContext } from "react";
import { UserContext } from "../../UserContext";




type UserOptionsProps = {
    showUserOptions: React.Dispatch<React.SetStateAction<boolean>>
    showAdminForm: React.Dispatch<React.SetStateAction<boolean>>
}


const DashNavbar: React.FC<UserOptionsProps> = ({ showUserOptions, showAdminForm }) => {

    const { user } = useContext(UserContext);



    const preventClosureOfMenu = (e: React.MouseEvent) => {

        e.stopPropagation();

        if(user?.admin){

            showAdminForm(current => !current);
        
        }else{

            showUserOptions(current => !current);
        }

    };



    return(

        <nav className="dashboard-nav p-2 d-flex flex-row justify-content-between align-items-center">

            <h2 className="pt-1">LuluFlix</h2>   

            <button className="admin-nav-button" onClick={preventClosureOfMenu}></button>

        </nav>
    )
}

export default DashNavbar