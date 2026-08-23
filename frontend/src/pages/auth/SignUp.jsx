import './SignUp.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';
import AppAlert from '../../components/ui/AppAlert';
import { useNavigate } from 'react-router-dom';

const url = import.meta.env.VITE_API_URL;

function SignUp() {

    const navigate = useNavigate();
    const [ alert, setAlert ] = useState(null);

    const [ formData, setFormData ] = useState({
            name: "",
            email: "",
            username: "",
            password: "",
        });
    
    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${url}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({
                    msg: data.message,
                    severity: "success"
                });

                setFormData({
                    name: "",
                    email: "",
                    username: "",
                    password: "",
                });
                navigate("/signin");
            } else {
                setAlert({
                    msg: data.message,
                    severity: "error"
                });
            }

        } catch (err) {
            setAlert({
                msg: err,
                severity: "error"
            });
        }
    }

    return (
        <div className='sign-up'>
            { alert && <AppAlert msg={alert.msg} severity={alert.severity} /> }
            <div>
                <h2>Welcome!</h2>
                <p>Let's create your account</p>
            </div>
            <form onSubmit={handleSubmit}>
                <TextField className='input' required name='name' value={formData.name} onChange={handleChange} id="outlined-required" label="Name" variant="outlined" />
                <TextField className='input' required name='email' value={formData.email} onChange={handleChange} id="outlined-required" label="Email" type="email" variant="outlined" />
                <TextField className='input' required name='username' value={formData.username} onChange={handleChange} id="outlined-required" label="Username" variant="outlined" />
                <TextField className='input' required name='password' value={formData.password} onChange={handleChange} id="outlined-password-input" label="Password" type="password" autoComplete="current-password" />
                <Button variant="contained" type='submit' color="success">Sign Up</Button>
            </form>
            <a href='/signIn'>Sign In</a>
        </div>
    )
}


export default SignUp;