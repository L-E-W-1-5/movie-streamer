import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { url } from "../../Url";
import './PasswordChange.css';


type PasswordProps = {

    setPasswordForm: React.Dispatch<React.SetStateAction<boolean>>
}


const PasswordChange: React.FC<PasswordProps> = ({setPasswordForm}) => {

    const { user } = useContext(UserContext);


    

    const [newPassword, setNewPassword] = useState<string>("");

    const [passwordCheck, setPasswordCheck] = useState<string>("");


    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {

        e.preventDefault();

        setNewPassword(e.target.value)
    };


    const passwordValidate = (e: React.ChangeEvent<HTMLInputElement>) => {

        e.preventDefault();

        setPasswordCheck(e.target.value);
    };


    const sendPassword = async () => {

        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

         if(!pattern.test(newPassword)){

            alert('password must be at least 10 letters long and have at least one uppercase character, one lowercase character and one number');

            return
        };

        if(newPassword !== passwordCheck){

            alert('passwords dont match')

            return;
        };

    
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
        });

        if(!res.ok){

            alert("server error, please try again later");
        }

        const response = await res.json()

        console.log(response)

        if(response.status === "success"){

            alert("password changed")

            setNewPassword("");

            setPasswordCheck("");

            setPasswordForm(false);
        
        }else{

            alert("password could not be changed, please try again")
        }
    };


    return(

        <div className="password-change-container border-shadow d-flex flex-column justify-content-around align-items-end p-3">

            <label>new password: 

                <input className="password-input border-shadow p-1" type="password" value={newPassword} onChange={changePassword}/>

            </label>

            <label>repeat new password: 

                <input className="password-input border-shadow p-1" type="password" value={passwordCheck} onChange={passwordValidate}/>

            </label>

            <button className="password-button border-shadow" onClick={sendPassword}>change</button>

            <button className="password-button border-shadow" onClick={() => setPasswordForm(false)}>close</button>


        </div>
    )

}

export default PasswordChange

//newPassword88