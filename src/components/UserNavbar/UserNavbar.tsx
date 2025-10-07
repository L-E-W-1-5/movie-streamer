import { useState } from 'react'
import './UserNavbar.css'
import { type User } from '../../Types/Types'



type UserNavbarProps = {

    allUsers: User[],
    //setAllUsers: React.Dispatch<React.SetStateAction<User[]>>
    setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>
    closeForm: (e: React.MouseEvent) => void
}


const UserNavbar: React.FC<UserNavbarProps> = ({allUsers, closeForm, setFilteredUsers}) => {

    const [searchUsers, setSearchUsers] = useState("");



    const handleSort = (e:React.ChangeEvent<HTMLSelectElement>) => {

        if(e.target.value === "by id"){

            const sortedUsers = [...allUsers].sort((a, b) => 

                parseInt(a.id) - parseInt(b.id)
            );

            setFilteredUsers(sortedUsers)
        }

        if(e.target.value === "by username"){

            const sortedusers = [...allUsers].sort((a, b) => 
            
                a.name.localeCompare(b.name)
            )

            setFilteredUsers(sortedusers)
        }

    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;



        setSearchUsers(value);

    }

    const handleGo = () => {
//e: React.KeyboardEvent<HTMLInputElement>
       // if(e.key !== 'Enter') return

        const filteredUsers = [...allUsers].filter(user => {return user.name.toLowerCase().includes(searchUsers.toLowerCase())})

        //const filteredUsers = [...allUsers].filter(user => {return user.name.toLowerCase() === searchUsers.toLowerCase()})

         console.log(filteredUsers)

        setFilteredUsers(filteredUsers)
    }


    return(

        <div className="d-flex flex-row justify-content-around align-items-center p-2">
        
            <input className="btn variable-colour border-shadow input-field" type="text" placeholder="search" onChange={handleSearch} onKeyDown={handleGo}></input>

            <select className="user-sort-element form-select variable-colour border-shadow" onChange={handleSort}>

                <option selected>--sort--</option>

                <option>by id</option>
                <option>by username</option>

            </select>

            <button className="btn border-shadow variable-colour" onClick={closeForm}>close</button>

        </div>
    )
}

export default UserNavbar