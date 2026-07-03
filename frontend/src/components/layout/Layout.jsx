import Header from './Header';
import './Layout.css';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
    return(
        <div className='layout'>
            <div className='layout-header'>
                <Header />
            </div>
            
            <div className='layout-content'>
                <div className='layout-left'>
                    <Sidebar />
                </div>
                <div className='layout-right'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}


export default Layout;