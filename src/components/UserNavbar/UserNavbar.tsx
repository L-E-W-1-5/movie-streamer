import { useState } from 'react'
import './UserNavbar.css'
import { type User } from '../../Types/Types'



type UserNavbarProps = {

    allUsers: User[],
    setAllUsers: React.Dispatch<React.SetStateAction<User[]>>
}


const UserNavbar: React.FC<UserNavbarProps> = ({allUsers, setAllUsers}) => {

    const [sortUsers, setSortUsers] = useState("");



    const handleSort = (e:React.ChangeEvent<HTMLSelectElement>) => {

        if(e.target.value){

            setSortUsers(e.target.value)
        };

        if(e.target.value === "by id"){

            const sortedUsers = [...allUsers].sort((a, b) => 

                parseInt(a.id) - parseInt(b.id)
            );

            setAllUsers(sortedUsers)
        }

        if(e.target.value === "by username"){

            const sortedusers = [...allUsers].sort((a, b) => 
            
                a.name.localeCompare(b.name)
            )
          

            console.log(sortedusers)

            setAllUsers(sortedusers)
        }

    };


    return(

        <div className="d-flex flex-row justify-content-around align-items-center">
        
            <input type="text" placeholder="search"></input>

            <select value={sortUsers} onChange={handleSort}>

                <option selected>--sort--</option>

                <option>by id</option>
                <option>by username</option>

            </select>

        </div>
    )
}

export default UserNavbar