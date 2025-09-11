import './LoginPage.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';


type FormFields = {
    email: string,
    password: string
}



const LoginPage = () => {

    const navigate = useNavigate();

    const { handleSubmit,
            register,
            formState: {errors} } = useForm<FormFields>();



    const onSubmit: SubmitHandler<FormFields> = (data) => {

        console.log(data)

        if(data.email === "lewiswootton" && data.password === "netflix88"){
            navigate('/dashboard');
        }
    };

    // const handlePage = () => {
    //     navigate('/dashboard');
    // }

    return (

    <div className="login-container border-shadow card d-flex justify-content-center align-items-center p-4 w-auto h-auto">

        <h2 className="variable-colour text-center mb-4">Login</h2>

        <form className="d-flex flex-column justify-content-center gap-2" onSubmit={handleSubmit(onSubmit)}>

            <div className="d-flex flex-column mb-3">

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

            </div>

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