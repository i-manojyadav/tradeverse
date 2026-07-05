import './SignIn.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';

function SignIn() {
    return (
        <div className='sign-in'>
            <h2>Sign In</h2>
            <form method='post'>
                 <TextField required id="outlined-required" label="Username" variant="outlined" />
                 <TextField required id="outlined-password-input" label="Password" type="password" autoComplete="current-password" />
                 <Button variant="contained" type='submit' color="success">Sign In</Button>
            </form>
        </div>
    )
}


export default SignIn;