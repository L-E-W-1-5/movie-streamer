import './LoginPage.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Link, useNavigate } from 'react-router';
import type { FormEvent } from 'react';



type userLogin = {
    userState: React.Dispatch<React.SetStateAction<boolean>>
}


const LoginPage: React.FC<userLogin> = ({userState}) => {

    const navigate = useNavigate();

    



    const onSubmit = (event:FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const form = event.currentTarget

        const formData = new FormData(form);
        
        const loginid = formData.get('loginid')?.toString() || "";


        if(loginid === "12345678"){

            userState(true);
            navigate('/dashboard');
        }
    };

   

    return (

    <div className="login-container border-shadow card d-flex justify-content-center align-items-center p-4 w-auto h-auto">

        <h2 className="variable-colour text-center mb-4">Login</h2>

        <form className="d-flex flex-column justify-content-center gap-2" onSubmit={onSubmit}>

            <input className="form-control input-field" name="loginid" type="text" placeholder="type login id here"/>

            <button className="btn variable-colour border-shadow" type="submit">Submit</button> 

            {/* <button className="btn variable-colour border-shadow" type="button" onClick={handlePage}>Development</button>  */}

            <div className="d-flex mt-3">

                <p className="variable-colour">or not signed up yet? <br></br><Link to='/register' className="cursor">sign up here</Link></p>
                
            </div>
        </form>


    
    </div>
    
)
}
// card d-flex justify-content-center align-items-center p-4 w-auto h-50
export default LoginPage;



{/* <div className="d-flex flex-column mb-3">

                <input className="form-control input-field"  
                    {...register("email", {
                        required: "you must enter a valid email address",
                        pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    })} 
                    type="text" 
                    placeholder="Email" 
                />
                {errors.email && (<div className="error-text fst-italic text-center text-wrap">{errors.email.message}</div>)}

            </div>

            <div className="d-flex flex-column mb-3">

                <input className="form-control input-field"
                    {...register("password", {
                        required: "password must be over 8 characters",
                        minLength: 8
                    })} 
                    type="password" 
                    placeholder="Password" 
                />
                {errors.password && <div className="error-text fst-italic text-center text-wrap">{errors.password.message}</div>}

            </div> */}