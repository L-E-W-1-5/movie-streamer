import { useState } from 'react'
import './UserNavbar.css'
import { type UserEdit } from '../../Types/Types'



type UserNavbarProps = {

    allUsers: UserEdit[],
    //setAllUsers: React.Dispatch<React.SetStateAction<User[]>>
    setFilteredUsers: React.Dispatch<React.SetStateAction<UserEdit[]>>
    // closeForm: (e: React.MouseEvent) => void
}


const UserNavbar: React.FC<UserNavbarProps> = ({allUsers, setFilteredUsers}) => {

    const [searchUsers, setSearchUsers] = useState("");



    const handleSort = (e:React.ChangeEvent<HTMLSelectElement>) => {

        if(e.target.value === "by id"){

            const sortedUsers = [...allUsers].sort((a, b) => 

                a.id - b.id
            );

            setFilteredUsers(sortedUsers)
        }

        if(e.target.value === "by username"){

            const sortedusers = [...allUsers].sort((a, b) => 
            
                a.username.localeCompare(b.username)
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

        const filteredUsers = [...allUsers].filter(user => {return user.username.toLowerCase().includes(searchUsers.toLowerCase())})

        //const filteredUsers = [...allUsers].filter(user => {return user.name.toLowerCase() === searchUsers.toLowerCase()})

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


        </div>
    )
}

export default UserNavbar