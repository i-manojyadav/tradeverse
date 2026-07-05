import './SignUp.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { useState } from 'react';

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
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("OK Response", data);

                setFormData({
                    name: "",
                    email: "",
                    username: "",
                    password: "",
                });
            } else {
                console.log("Something Wrong");
            }

        } catch (err) {
            console.log("Server Error:", err);
        }
    }

    return (
        <div className='sign-up'>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <TextField required name='name' value={formData.name} onChange={handleChange} id="outlined-required" label="Name" variant="outlined" />
                <TextField required name='email' value={formData.email} onChange={handleChange} id="outlined-required" label="Email" variant="outlined" />
                <TextField required name='username' value={formData.username} onChange={handleChange} id="outlined-required" label="Username" variant="outlined" />
                <TextField required name='password' value={formData.password} onChange={handleChange} id="outlined-password-input" label="Password" type="password" autoComplete="current-password" />
                <Button variant="contained" type='submit' color="success">Sign Up</Button>
            </form>
        </div>
    )
}


export default SignUp;