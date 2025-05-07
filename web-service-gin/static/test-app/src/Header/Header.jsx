import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import icon from './whatsapp.png';
import logo from './logo.png';
import { menuItems } from '../data/menuItems';
import GuestButtons from './GuestButtons';
import UserButtons from './UserButtons';
import AdminButtons from './AdminButtons'
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import './Header.css'

function Header() {
    const [loginSection, setLoginSection] = useState(<GuestButtons/>);

    useEffect(() => {
        const navMenu  = document.querySelector('.nav-menu');
        const logoMenu = document.querySelector('.logo-section');
        logoMenu.style.marginTop = `${navMenu.offsetHeight + 10}px`;
    });

    const { user } = useContext(AuthContext);
    useEffect(() => {
        console.log(user)
        setLoginSection(<GuestButtons/>);
        if (user && user.isAdmin) {
            setLoginSection(<AdminButtons/>);
        }
        else if (user) {
            setLoginSection(<UserButtons/>);
        }
    }, [user]);

    const menuLinkElements = menuItems.map(menuItem => 
        <Link to={menuItem.link} key={menuItem.id}><span className='top-bar-item'>{menuItem.text}</span></Link>
    );

    const header =
        <header>
                <nav>
                    <div className='nav-menu'>
                        <div className='top-menu-items'>
                            {menuLinkElements}
                        </div>
                        <a href='https://wa.me/79272229423' target="_blank"><img className='whatsapp-icon' src={icon}/></a>
                    </div>
                    <hr/>
                </nav>
                <div className='logo-section'>
                    <div className='logo-info-section'>
                        <Link to="/"> <span className='logo logo-info-item'> Boat Tent 64 </span> </Link>
                        <a href='tel:+79272229423' target="_blank"><span className='phone-number logo-info-item'>+79272229423</span></a>
                        <span className='working-hours logo-info-item'>пн - пт с 9:00 до 18:00 (МСК+1)</span>
                    </div>
                    {loginSection}
                </div>
        </header>
    ;

    return header;
}

export default Header;