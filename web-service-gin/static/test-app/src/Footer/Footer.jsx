import { useEffect } from 'react';
import { Link }      from 'react-router-dom';
import { categories } from '../data/catalog';
import { menuItems }  from '../data/menuItems';
import whatsapp  from './whatsapp.png';
import telegram  from './telegram.png';
import instagram from './instagram.png';
import vk        from './vk.png';
import './Footer.css';

function Footer() {

    const catalogElements = categories.map(catalogItem => 
        <Link key={catalogItem.id} to='/shop' state={{ catalogItem: catalogItem }}>
            <div className='footer-catalog-item footer-text' key={catalogItem.id}>{catalogItem.id}. {catalogItem.title}</div>
        </Link>
    );
    const menuLinkElements = menuItems.map(menuItem => 
        <Link to={menuItem.link} key={menuItem.id}><span className='footer-menu-item footer-text'>{menuItem.text}</span></Link>
    )

    return (
        <footer>
            <div className='footer-upper-level'>
                <div className='footer-menu'>
                    <div className='footer-menu-title footer-text'>Меню</div>
                    {menuLinkElements}
                </div>
                <div className='footer-catalog-section'>
                    <div className='footer-catalog-title footer-text'>Каталог</div>
                    <div className='footer-catalog-grid'>
                        {catalogElements}
                    </div>
                </div>  
            </div>
            <div className='footer-lower-level'>
                <div className='footer-legal-item footer-text'>
                    &copy; {new Date().getFullYear()} Интренет-магазиг<br/> "Boat Tent 64"
                </div>
                <div className='footer-socials-section'>
                    <a href='https://wa.me/79272229423' target="_blank"><img className='footer-socials-icon' src={whatsapp}/> </a>
                    <a href='https://t.me/+79272229423' target="_blank"><img className='footer-socials-icon' src={telegram}/> </a>
                    <a href='https://vk.com/boat_tent' target="_blank"><img className='footer-socials-icon' src={vk}/>       </a>
                    <a href='https://www.instagram.com/boat_tent' target="_blank"><img className='footer-socials-icon' src={instagram}/></a>
                </div>
                <div className='footer-phone-item'>
                <a href='tel:+79272229423' target="_blank"><span className='footer-phone-number footer-text'>+79272229423</span></a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;