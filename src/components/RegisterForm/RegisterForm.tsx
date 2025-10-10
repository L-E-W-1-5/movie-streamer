import { useNavigate, Link } from 'react-router';
import { type SubmitHandler, useForm } from 'react-hook-form';
import './RegisterForm.css'
import { url } from '../../Url';


//TODO: url change
//const url = 'http://localhost:3001';
//const url = 'https://movie-streamer-backend.onrender.com'

type RegisterFields = {
    name: string,
    email: string
}

const RegisterForm = () => {

    const navigate = useNavigate();

    const { handleSubmit,
                register,
                formState: {errors} } = useForm<RegisterFields>();


    const onSubmit: SubmitHandler<RegisterFields> = async (data) => {

        const res = await sendUserData(data);

        alert(`${res.payload}`);

        navigate('/');
    };


    const sendUserData = async (data:RegisterFields) => {

        const res = await fetch(`${url}/users/newuser`, {

            method: 'POST',

            headers: {'Content-Type':'application/json'},

            body: JSON.stringify(data)
        });

        const result = await res.json();

        if(!res.ok || result.status === "error"){

            alert(`${res.status}: error creating user`);
        };

        return result;
    }


    return (

        <div className="register-container border-shadow p-4 card">

            <h2 className="variable-colour text-center mb-4">Register</h2>

            <form className="d-flex flex-column justify-content-center gap-2" onSubmit={handleSubmit(onSubmit)}>

                <div className="mb-3 d-flex flex-column">

                    <input
                        className="form-control input-field border-shadow"
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
                        className="form-control input-field border-shadow"
                        {...register("email", {
                            required: "must enter a valid email",
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: "invalid email format"
                            }
                        })}
                        type="text"
                        placeholder="Email Address"  
                    />
                 {errors.email && (<div className="error-text fst-italic text-center text-wrap" >{errors.email.message}</div>)}
               
                </div>


                <button className="btn variable-colour border-shadow" type="submit">Submit</button>

                <Link to='/'>sign in</Link>

            </form>



        </div>
    )
};

export default RegisterForm;