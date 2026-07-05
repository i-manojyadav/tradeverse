import './SignIn.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Box, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

function SignIn() {

    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [ signInInfo, setSignInInfo ] = useState({username: "", password: ""});

    function handleChange(e) {
        setSignInInfo({...signInInfo, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(signInInfo),
            });

            const data = await response.json();

            if (response.ok) {
                setSignInInfo({ username: "", password: ""});
                setUser(data.user);
                navigate("/");
            } else {
                console.log("Something went wrong");
            }

        } catch(err) {
            console.log("Server Error:", err);
        }
    }

    return (
        <div className='sign-in'>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                 <TextField required name='username' value={signInInfo.username} onChange={handleChange} id="outlined-required" label="Username" variant="outlined" />
                 <TextField required name='password' value={signInInfo.password} onChange={handleChange} id="outlined-password-input" label="Password" type="password" autoComplete="current-password" />
                 <Button variant="contained" type='submit' color="success">Sign In</Button>
            </form>
            <a style={{color: "#ffffff"}}>Forget Password?</a>
        </div>
    )
}


export default SignIn;