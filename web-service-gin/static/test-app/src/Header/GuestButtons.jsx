import { Link } from 'react-router-dom';

function GuestButtons() {
    return (
        <div className='logo-login-section'>
            <Link to="/login">    <span className='account-item'>Войти      </span></Link>
            <Link to="/register"> <span className='account-item'>Регистрация</span></Link>
        </div>
    );
}

export default GuestButtons;