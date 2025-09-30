import './UserEditForm.css'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../UserContext'

//TODO: url change from development 
//const url = 'http://localhost:3001';
const url = 'https://movie-streamer-backend.onrender.com'



// type User {
//     id: string,
//     username: string,
//     email: string,
//     verified: boolean,
//     admin: boolean,
//     token: string
// };


type UserEdit = {
    id: string,
    name: string,
    email: string,
    guid: string,
    is_verified: boolean,
    is_admin: boolean,

};

type UserEditProps = {

    userEditForm: boolean;
    showUserEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserEditForm: React.FC<UserEditProps> = ({showUserEditForm, userEditForm }) => {

    const { user } = useContext(UserContext);

    const [allUsers, setAllUsers] = useState<UserEdit[]>([]);



    useEffect(() => {


        const fetchUsers = async () => {

            const res = await fetch(`${url}/users`, {
                
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${user!.token}`
                },

            });

            const response = await res.json();

            if(!res.ok || response.status === "error"){

                alert(`${response.payload}`);

                return;
            }

            setAllUsers(response.payload);

            console.log(response.payload);
        };



        if(user?.admin && user.token){

            fetchUsers();
            
        }


    }, [userEditForm, user])


    const closeForm = (e: React.MouseEvent) => {

        e.stopPropagation();

        showUserEditForm(false);
    }


    return (
    <div className="edit-form border-shadow d-flex gap-3 p-3 justify-content-around align-items-center">


        <div className="map-container d-flex flex-column justify-content-start align-items-center">

        {allUsers.map((useredit: UserEdit, index: number) => {

            return (

            <div key={index} className="record-container d-flex flex-row">

                <span className="edit-field-item">{useredit.id}</span>
                <span className="edit-field-item flex-fill">{useredit.name}</span>
                <span className="edit-field-item flex-fill">{useredit.email}</span>
                <span style={{"backgroundColor": useredit.is_admin ? 'green' : 'red'}} className="edit-field-item">{`admin: ${useredit.is_admin}`}</span>
                <span style={{"backgroundColor": useredit.is_verified ? 'green' : 'red'}} className="edit-field-item">{`verified: ${useredit.is_verified}`}</span>
            
            </div>
            )
        })}

        </div>


        <button className="edit-form-button btn border-shadow variable-colour" onClick={closeForm}>close</button>

    </div>

    );
};

export default UserEditForm;

// container-style d-flex flex-row justify-content-center pt-5 align-items-center gap-2