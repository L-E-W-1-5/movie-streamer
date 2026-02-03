import './UserEditForm.css'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../UserContext'
import UserView from '../UserView/UserView.js'
import UserNavbar from '../UserNavbar/UserNavbar.js'
import { type UserEdit } from '../../Types/Types.js'
import tick from '../../assets/tick1.png' 
import cross from '../../assets/cross1.png'
import { url } from '../../Url';




type UserEditProps = {

    userEditForm: boolean;
    showUserEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserEditForm: React.FC<UserEditProps> = ({showUserEditForm, userEditForm }) => {

    const { user } = useContext(UserContext);

    const [allUsers, setAllUsers] = useState<UserEdit[]>([]);

    const [filteredUsers, setFilteredUsers] = useState<UserEdit[]>([])

    const [userOptionsMenu, showUserOptionsMenu] = useState<{
        user: UserEdit,
        position: {top: number; left: number}
     } | null>(null);



    useEffect(() => {


        const fetchUsers = async () => {

            const res = await fetch(`${url}/users`, {
                
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${user!.token}`
                },

            });

            const response = await res.json() as {
                    payload: UserEdit[];
                    status: string;
                };

            if(!res.ok || response.status === "error"){

                alert(`${response.payload}`);

                return;
            }

            setAllUsers(response.payload);

            setFilteredUsers(response.payload);
        };



        if(user?.admin && user.token){

            fetchUsers();
            
        }


    }, [userEditForm, user])


    const closeForm = (e: React.MouseEvent) => {

        e.stopPropagation();

        showUserEditForm(false);
    };


     const closeUserEditForm = (e: React.MouseEvent) => {

        e.stopPropagation();

        showUserOptionsMenu(null);
    };


    const userOptions = (user: UserEdit, e: React.MouseEvent) => {

        const containerPosition = e.currentTarget.closest('.edit-form')?.getBoundingClientRect();

        const mouseX = e.clientX;

        //const mouseY = e.clientY;

        const scrollContainerLeft = e.currentTarget.closest('.edit-form')?.scrollLeft || 0;

        const scrollContainerTop = e.currentTarget.closest('.edit-form')?.scrollTop || 0;

        const top = scrollContainerTop - (containerPosition?.top || 0) + 200; //mouseY + (at the start of this line)

        const left = mouseX + scrollContainerLeft - (containerPosition?.left || 0);

        
        // console.log("scroll container", scrollContainerLeft, scrollContainerTop)

        // console.log("mouse position", mouseX, mouseY)

        // console.log(top)

        showUserOptionsMenu({ 
            user, 
            position: {top, left}
        });
    }


    return (
        
    <div className="edit-form border-shadow d-flex gap-3 justify-content-between align-items-center">

        <div className="map-navbar">

            <UserNavbar allUsers={allUsers} setFilteredUsers={setFilteredUsers}/>

        </div>

        <div className="map-container-user d-flex flex-column justify-content-start align-items-center">

            {filteredUsers.map((userEdit: UserEdit, index: number) => {

                return (

                <div key={index} className="record-container-user border-shadow container-style d-flex flex-column mb-2 p-2"
                    onClick={(e) => userOptions(userEdit, e)}
                >

                    <span className="edit-field-item-user">{userEdit.id}</span>
                    <span className="edit-field-item-user flex-fill">{userEdit.username}</span>
                    <span className="edit-field-item-user d-flex flex-row justify-content-between">{`admin: ${userEdit.is_admin}`}<img src={userEdit.is_admin ? tick : cross} width="25px" height="25px"/></span>
                    <span className="edit-field-item-user d-flex flex-row justify-content-between">{`verified: ${userEdit.is_verified}`}<img src={userEdit.is_verified ? tick : cross} width="25px" height="25px"/></span>
                    
            
                </div>
                )
            })}

        </div>

         {userOptionsMenu &&
        
            <div className="user-options-menu border-shadow container-style h-50 w-50 p-3 d-flex flex-column justify-content-around" style={{top: userOptionsMenu.position.top, left: "25%"}}>
  
                <UserView userEdit={userOptionsMenu.user}/>
                            
                <button className="button-style border-shadow align-self-center" onClick={closeUserEditForm}>close</button>

            </div>
        }

        <button className="button-style border-shadow" onClick={closeForm}>close</button>

    </div>

    );
};

export default UserEditForm;

// container-style d-flex flex-row justify-content-center pt-5 align-items-center gap-2