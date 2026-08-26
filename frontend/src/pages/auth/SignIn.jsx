import './SignIn.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Box, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AppAlert from '../../components/ui/AppAlert';

const url = import.meta.env.VITE_API_URL;

function SignIn() {

    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [ alert, setAlert ] = useState(null);

    const [ signInInfo, setSignInInfo ] = useState({username: "", password: ""});

    function handleChange(e) {
        setSignInInfo({...signInInfo, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(signInInfo),
            });

            const data = await response.json();

            if (response.ok) {
                setAlert({
                    msg: data.message,
                    severity: "success"
                });
                setSignInInfo({ username: "", password: ""});
                setUser(data);
                navigate("/");
            } else {
                setAlert({
                    msg: data.message,
                    severity: "error"
                });
                setSignInInfo({ username: "", password: ""});
                navigate("/signin");
            }

        } catch(err) {
            setAlert({
                msg: err,
                severity: "error"
            });
        }
    }

    return (
        <div className='sign-in'>
            { alert && <AppAlert msg={alert.msg} severity={alert.severity} /> }
            <div>
                <h2>Welcome back</h2>
                <p>Sign In to your account</p>
            </div>
            <form onSubmit={handleSubmit}>
                 <TextField className='input' required name='username' value={signInInfo.username} onChange={handleChange} id="outlined-required" label="Username" variant="outlined" />
                 <TextField className='input' required name='password' value={signInInfo.password} onChange={handleChange} id="outlined-password-input" label="Password" type="password" autoComplete="current-password" />
                 <Button variant="contained" type='submit' color="success">Sign In</Button>
            </form>
            <a href='/signup'>Create your account</a>
        </div>
    )
}


export default SignIn;