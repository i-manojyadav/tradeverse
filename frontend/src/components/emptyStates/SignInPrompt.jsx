import { NavLink } from 'react-router-dom';
import './SignInPrompt.css';

function SignInPrompt() {
    return (
        <div className='sign-in-prompt'>
            <div className='sip-title'>
                <i className="fa-regular fa-user"></i>
                <h2>Sign in to continue</h2>
                <p>Sign in to access this feature.</p>
            </div>
            <div className='sip-action'>
                <NavLink className='sip-btn' to='/signin'>Sign In</NavLink>
                <NavLink className='sip-btn' to='/signup'>Sign Up</NavLink>
            </div>
        </div>
    )
}


export default SignInPrompt;