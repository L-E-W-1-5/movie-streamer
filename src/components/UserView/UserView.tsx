import {type User} from '../../Types/Types.ts'
import { useContext } from 'react'
import { UserContext } from '../../UserContext.ts'



//TODO: url change from development 
const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'


const UserView: React.FC<{userEdit: User}> = ({ userEdit }) => {

    const { user } = useContext(UserContext);



    const deleteUser = async () => {

        if(!user?.token) return

        try{

            console.log(userEdit)

            const res = await fetch(`${url}/users/delete-user`, {
                method: 'POST',
    
                headers: {
                    'Content-Type' : 'application/json',
                    'authorization': `Bearer ${user.token}`
                },

                body: JSON.stringify(userEdit)
            });

            const response = await res.json();

            if(!res.ok || response.status === "error"){

                alert(`error: ${response.payload}`)

                return;

            }else{

                alert(`user ${response.payload} deleted!`);
            };



        }catch(err){

            console.log(err);
        }
    }

    return(
        <div className="d-flex flex-column variable-colour gap-1">

            <span>{userEdit.id}</span>
            <span>{userEdit.name}</span>
            <span>{userEdit.guid}</span>
            <span>{userEdit.email}</span>
            <span>{`verified: ${userEdit.is_verified}`}</span>
            <span>{`admin: ${userEdit.is_admin}`}</span>

            <div className="align-self-center d-flex gap-3 mt-4">

                <button className="btn border-shadow variable-colour">make admin</button>
                <button className="btn border-shadow variable-colour">verify</button>
                <button className="btn border-shadow variable-colour" onClick={deleteUser}>delete</button>

            </div>

        </div>
    )
}

export default UserView;