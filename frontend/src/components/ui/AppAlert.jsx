import { Snackbar } from '@mui/material';
import './AppAlert.css';
import Alert from '@mui/material/Alert';
import { useState } from 'react';


function AppAlert({ msg, severity }) {

    const [ isActive, setIsActive ] = useState(true);

    return (
        <div className='app-alert'>
            <Snackbar
            open={isActive}
            autoHideDuration={2000}
            onClose={() => setIsActive(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={severity}>{msg}</Alert>
            </Snackbar>
        </div>
    )
}


export default AppAlert;