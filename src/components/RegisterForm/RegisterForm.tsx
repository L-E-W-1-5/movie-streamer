
import { useNavigate } from 'react-router';
import { type SubmitHandler, useForm } from 'react-hook-form';
import './RegisterForm.css'


type RegisterFields = {
    name: string,
    email: string
}

const RegisterForm = () => {

    const navigate = useNavigate();

    const { handleSubmit,
                register,
                formState: {errors} } = useForm<RegisterFields>();


    const onSubmit: SubmitHandler<RegisterFields> = (data) => {
        
        console.log(data);

        alert("An email will be sent to your email address once verification is complete.");

        navigate('/');
    }


    return (

        <div className="register-container border-shadow p-4 card">

            <h2 className="variable-colour text-center mb-4">Register</h2>

            <form className="d-flex flex-column justify-content-center gap-2" onSubmit={handleSubmit(onSubmit)}>

                <div className="mb-3 d-flex flex-column">

                    <input
                        className="form-control input-field"
                        {...register("name", {
                            required: "you must use your full name",
                            validate: {
                                fullName: value => value.trim().split(/\s+/).length > 1 || 'full name is required'
                            }
                        })}
                        type="text"
                        placeholder="Full Name"
                    />
                {errors.name && (<div className="error-text fst-italic text-center text-wrap" >{errors.name.message}</div>)}
                
                </div>

                <div className="mb-3 d-flex flex-column">

                    <input
                        className="form-control input-field"
                        {...register("email", {
                            required: "must enter a valid email",
                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
                        })}
                        type="text"
                        placeholder="Email Address"  
                    />
                 {errors.email && (<div className="error-text fst-italic text-center text-wrap" >{errors.email.message}</div>)}
               
                </div>


                <button className="btn variable-colour border-shadow" type="submit">Submit</button>

            </form>



        </div>
    )
};

export default RegisterForm;