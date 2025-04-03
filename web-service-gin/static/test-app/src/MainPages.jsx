import { Outlet } from 'react-router-dom';
import Header from './Header/Header'
import Footer from './Footer/Footer';

function MainPage() {
    return (
        <>
        <Header/>
        <div className='main-container'>
            <Outlet/>
        </div>
        <Footer/>
        </>
    );
}

export default MainPage;