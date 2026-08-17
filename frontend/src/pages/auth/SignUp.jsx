import './SignUp.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';

const url = import.meta.env.VITE_API_URL;

function SignUp() {

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
                <AppAlert msg={data.message} severity={"success"} />

                setFormData({
                    name: "",
                    email: "",
                    username: "",
                    password: "",
                });
            } else {
                <AppAlert msg={data.message} severity={"error"} />
            }

        } catch (err) {
            <AppAlert msg={err} severity={"error"} />
        }
    }

    return (
        <div className='sign-up'>
            <div>
                <h2>Welcome!</h2>
                <p>Let's create your account</p>
            </div>
            <form onSubmit={handleSubmit}>
                <TextField className='input' required name='name' value={formData.name} onChange={handleChange} id="outlined-required" label="Name" variant="outlined" />
                <TextField className='input' required name='email' value={formData.email} onChange={handleChange} id="outlined-required" label="Email" variant="outlined" />
                <TextField className='input' required name='username' value={formData.username} onChange={handleChange} id="outlined-required" label="Username" variant="outlined" />
                <TextField className='input' required name='password' value={formData.password} onChange={handleChange} id="outlined-password-input" label="Password" type="password" autoComplete="current-password" />
                <Button variant="contained" type='submit' color="success">Sign Up</Button>
            </form>
            <a href='/signIn'>Sign In</a>
        </div>
    )
}


export default SignUp;