import { type UserEdit } from '../../Types/Types.ts'
import { useContext } from 'react'
import { UserContext } from '../../UserContext.ts'



//TODO: url change from development 
//const url = 'http://localhost:3001';
const url = 'https://movie-streamer-backend.onrender.com'


const UserView: React.FC<{userEdit: UserEdit}> = ({ userEdit }) => {

    const { user } = useContext(UserContext);



    const deleteUser = async (route: string) => {

        if(!user?.token) return;

        try{

            const res = await fetch(`${url}/users/${route}`, {

                method: 'POST',
    
                headers: {
                    'Content-Type' : 'application/json',
                    'authorization': `Bearer ${user.token}`
                },

                body: JSON.stringify(userEdit)
            });

            const response = await res.json();

            if(!res.ok || response.status === "error"){

                console.log(response.payload);

                alert(`error: ${response.payload}`);

                return;

            }else{

                alert(`${response.payload}`);

                if(response.operation === "admin"){

                    userEdit.is_admin = !userEdit.is_admin;

                    return;
                }

                if(response.operation === "delete"){

                    
                    userEdit.username = "deleted";
                    userEdit.email = "deleted";

                    return;

                }

                if(response.operation === "verification"){

                    userEdit.is_verified = !userEdit.is_verified;

                    return;
                }

            };

        }catch(err){

            console.log(err);
        };
    };




    return(

        <div className="d-flex flex-column variable-colour gap-1">

            <span>{userEdit.id}</span>
            <span>{userEdit.username}</span>
            <span className="edit-field-item-user flex-fill">{userEdit.email}</span>
            <span className="edit-field-item-user flex-fill">{userEdit.is_loggedin}</span>
            <span className="edit-field-item-user flex-fill">{`last login: ${userEdit.last_login}`}</span>
            <span className="edit-field-item-user flex-fill">{`time created: ${userEdit.time_created}`}</span>
            <span className="edit-field-item-user flex-fill">{`failed login attempts: ${userEdit.login_attempts}`}</span>
            <span>{`verified: ${userEdit.is_verified}`}</span>
            <span>{`admin: ${userEdit.is_admin}`}</span>

            <div className="align-self-center d-flex gap-3 mt-4">

                <button className="btn border-shadow variable-colour" onClick={() => deleteUser(`change_admin`)}>admin</button>
                <button className="btn border-shadow variable-colour" onClick={() => deleteUser(`change_verify`)}>verify</button>
                <button className="btn border-shadow variable-colour" onClick={() => deleteUser(`delete_user`)}>delete</button>

            </div>

        </div>
    )
}

export default UserView;