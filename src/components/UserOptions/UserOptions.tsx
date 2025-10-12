import './UserOptions.css'
import { url } from '../../Url'
import { useState, useContext } from 'react'
import { UserContext } from '../../UserContext'




const UserOptions = () => {

    const { user } = useContext(UserContext)

    const [password, setPassword] = useState<boolean>(false);

    const [newPassword, setNewPassword] = useState<string>("");

    const [passwordCheck, setPasswordCheck] = useState<string>("");


    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {

        e.preventDefault();

        console.log(newPassword)

        setNewPassword(e.target.value)
    }

    const passwordValidate = (e: React.ChangeEvent<HTMLInputElement>) => {

        e.preventDefault();

        console.log(passwordCheck);

        setPasswordCheck(e.target.value);
    }

    const sendPassword = async () => {

        if(newPassword !== passwordCheck){

            alert('passwords dont match')

            return;
        }

        if(newPassword.length < 10){

            alert('password must be at least 10 letters long');

            return
        }
        


        const res = await fetch(`${url}/users/change_password`, {

            method: 'POST',

            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user?.token}`
            },

            body: JSON.stringify({
                newPassword,
                user
            })
        })

        const response = await res.json()

        if(res.ok && response.status === "success"){

            alert("password changed")
        }
    }


    return(

    <>

        <div className="user-options-menu border-shadow d-flex flex-column justify-content-around">

            <button className="user-options-button btn variable-colour border-shadow">logout</button>
            <button className="user-options-button btn variable-colour border-shadow" onClick={() => setPassword(true)}>change password</button>
        
        </div>

        {password &&

            <div className="password-change-container border-shadow d-flex flex-column justify-content-around">

                <label>new password

                    <input type="text" value={newPassword} onChange={changePassword}/>

                    <input type="text" value={passwordCheck} onChange={passwordValidate}/>

                    <button onClick={sendPassword} >change</button>

                </label>

            </div>
        }

    </>
    )
}

export default UserOptions