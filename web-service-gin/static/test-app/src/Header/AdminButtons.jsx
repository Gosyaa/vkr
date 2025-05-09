import { Link } from 'react-router-dom';
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import cartIcon from './cart.svg'
import { CartContext } from '../context/CartContext';

function UserButtons() {
    const { logout } = useContext(AuthContext); 
    const { cart }   = useContext(CartContext);
    const navigate = useNavigate();   

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };

    const getCartLength = () => {
        const length = cart.length;
        if (length === 0) {
            return "";
        }
        return `(${length})`;
    }

    return (
        <div className='logo-login-section'>
            <Link to="/admin"><span className='admin-item'>Режим администратора </span></Link>
            <Link to="/cart">
            <div className='header-cart-section'>
                <img className='cart-icon' src={cartIcon}/>
                {getCartLength()}
            </div></Link>
            <Link to="/personal"><span className='account-item'>Личный кабинет</span></Link>
            <button onClick={handleLogout} className='logout-button'>Выйти</button>
        </div>
    );
}

export default UserButtons;