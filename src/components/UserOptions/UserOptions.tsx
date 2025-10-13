import './UserOptions.css'
//import { url } from '../../Url'
import { useState } from 'react'
//import { UserContext } from '../../UserContext'
import PasswordChange from '../PasswordChange/PasswordChange'


type UserOptionsProps = {
    logout: () => void
}


const UserOptions: React.FC<UserOptionsProps> = ({ logout }) => {

    //const { user } = useContext(UserContext)

    const [passwordForm, setPasswordForm] = useState<boolean>(false);


    // const closeForm = () => {

    //     setPasswordForm(false);
    // }


    return(

    <>

        <div className="user-nav-menu border-shadow d-flex flex-column p-2">

            <button className="user-options-button p-2" onClick={logout}>logout</button>

            <button className="user-options-button p-2" onClick={() => setPasswordForm(true)}>change password</button>
        
        </div>

        {passwordForm &&

            // <div className="password-change-container border-shadow d-flex flex-column justify-content-around">

            //     <label>new password

            //         <input type="text" value={newPassword} onChange={changePassword}/>

            //         <input type="text" value={passwordCheck} onChange={passwordValidate}/>

            //         <button onClick={sendPassword}>change</button>

            //         <button onClick={closeForm}>close</button>

            //     </label>

            // </div>

            <PasswordChange setPasswordForm={setPasswordForm}/>
        }

    </>
    )
}

export default UserOptions