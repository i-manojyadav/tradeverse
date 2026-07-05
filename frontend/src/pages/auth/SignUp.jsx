import './SignUp.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';

function SignUp() {
    
    function signUp(e) {
        e.preventDefault();
        
        e.target.reset();
    }

    return (
        <div className='sign-up'>
            <h2>Sign Up</h2>
            <form onSubmit={signUp}>
                <TextField required name='name' id="outlined-required" label="Name" variant="outlined" />
                <TextField required name='email' id="outlined-required" label="Email" variant="outlined" />
                <TextField required name='username' id="outlined-required" label="Username" variant="outlined" />
                <TextField required name='password' id="outlined-password-input" label="Password" type="password" autoComplete="current-password" />
                <Button variant="contained" type='submit' color="success">Sign Up</Button>
            </form>
        </div>
    )
}


export default SignUp;