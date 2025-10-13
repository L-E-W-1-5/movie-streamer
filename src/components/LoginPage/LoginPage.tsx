import './LoginPage.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../../UserContext';
import { Link, useNavigate } from 'react-router';
import { type FormEvent, useContext, useEffect, useState } from 'react';
import { url } from '../../Url';
//import { type User } from '../../Types/Types';



// type userLogin = {
//     userState: React.Dispatch<React.SetStateAction<boolean>>
// }



const LoginPage = () => {

    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext)

    const [loading, setLoading] = useState(false);

    
    useEffect(() => {

        
        if(!user){
            
            const sessionData = sessionStorage.getItem('session_user');

            if(sessionData){

                const userLoad = JSON.parse(sessionData)
    
                setUser(userLoad)
            }

        }

        if(user?.token){

            sessionStorage.setItem('session_user', JSON.stringify(user))

            navigate('/dashboard');
        }

    }, [user, navigate, setUser])


    const onSubmit = (event:FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const form = event.currentTarget

        const formData = new FormData(form);
        
        const loginid = formData.get('loginid')?.toString() || "";

        const loginEmail = formData.get('loginEmail')?.toString() || ""

        handleLogin(loginid, loginEmail)
    };


    const handleLogin = async (guid: string, email: string) => {

        const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

        if(!guid || !email){

            alert("must input both fields");

            return;
        };

        if(guid.length < 10){

            alert("password length must be 10 letters or over");

            return;
        }

        if(!pattern.test(email)){

            alert("invalid email format");

            return;
        }

        setLoading(true);

        try{

            const res = await fetch(`${url}/users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({guid, email})
            })

            const response = await res.json();
    
            if(response.status === "error"){

                alert(response.payload);

                return;
            }

            if(response.status === "success"){

                setUser(response.payload)
            }
    

        }catch(err){

            console.log(err);

            alert(err)
        
        }finally{

            setLoading(false);
        }

        //TODO: create loading animation
    }

   

    return (

    <div className="login-container border-shadow card d-flex justify-content-center align-items-center p-4 w-auto h-auto">

        <h2 className="variable-colour text-center mb-4">Login</h2>

        <form className="d-flex flex-column justify-content-center gap-2" onSubmit={onSubmit}>

            <input className="form-control input-field border-shadow" name="loginEmail" type="text" placeholder="email address"/>

            <input className="form-control input-field border-shadow" name="loginid" type="password" placeholder="password"/>

            <button className="btn variable-colour border-shadow" type="submit">Submit</button> 

            <div className="d-flex mt-3">

                <p className="variable-colour">or not signed up yet? <br></br><Link to='/register' className="cursor">sign up here</Link></p>
                
            </div>


        </form>

        {loading && 
        
            <div className="login-loading-animation">

                <h1>Loading...</h1>

            </div>
        
        }
    
    </div>
    
)
}

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