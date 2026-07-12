import { useContext } from 'react';
import './Profile.css'
import { AuthContext } from '../../context/AuthContext';

function Profile() {

    const { user } = useContext(AuthContext);

    return (
        <div className='profile'>
            <p><span>Name:</span> <span className='user-name'>{user?.user?.name}</span></p>
            <p><span>Email:</span> <span className='user-email'>{user?.user?.email}</span></p>
            <p><span>Username:</span> <span className='user-username'>{user?.user?.username}</span></p>
        </div>
    )
}


export default Profile;