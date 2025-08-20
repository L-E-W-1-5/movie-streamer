import './LoginPage.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { type SubmitHandler, useForm } from 'react-hook-form';


type FormFields = {
    email: string,
    password: string
}



const LoginPage = () => {

    const { handleSubmit,
            register,
            formState: {errors} } = useForm<FormFields>();


    const onSubmit: SubmitHandler<FormFields> = (data) => {

        console.log(data)
    }

    return (

    <div className="card d-flex justify-content-center align-items-center p-4 w-auto h-50 bg-light border-3  border-primary">

        <h2 className="text-center mb-4">Login</h2>

        <form className="d-flex flex-column justify-content-center gap-2" onSubmit={handleSubmit(onSubmit)}>

            <div className="d-flex flex-column mb-3">

                <input className="form-control" 
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

                <input className="form-control"
                    {...register("password", {
                        required: "password must be over 8 characters",
                        minLength: 8
                    })} 
                    type="password" 
                    placeholder="Password" 
                />
                {errors.password && <div className="error-text fst-italic text-center text-wrap">{errors.password.message}</div>}

            </div>

            <button className="btn btn-primary" type="submit">Submit</button> 

            <div className="d-flex mt-3">

                <p className="">or not signed up yet? <br></br><a className="w-50">sign up here</a></p>
                
            </div>
        </form>


    
    </div>
    
)
}
//
export default LoginPage;