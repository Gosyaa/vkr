import { Link } from 'react-router-dom';
import banner from './banner.jpg';
import dot    from './dot.png';
import sunbrella from './sunbrella.png';
import sauleda from './sauleda.jpg';
import achilles from './achilles.png';
import './Catalog.css';
import categories from '../data/catalog.jsx';

function Catalog () {
    const catalogItems = categories.categories.sort((a, b) => b.weight - a.weight);
    const catalogSection = catalogItems.map(catalogItem =>
        <Link key={catalogItem.id} to='/shop' state={{ catalogItem: catalogItem }}>
            <div className='catalog-item'>
                <img className='catalog-item-cover' src={catalogItem.image}/>
                <div className='catalog-item-text-section'>
                    <span className='category-title'>{catalogItem.title}</span>
                    <span className='category-catalog-link'>Все товары</span>
                </div>        
            </div>
        </Link>
    );

    const brandsSection = 
        <div className='brands-container'>
            <h2 className='brands-section-title'>Товары мировых брендов</h2>
            <div className='brands-logo-section'>
                <img className='brands-logo' src={achilles}/>
                <img className='brands-logo' src={dot}/>
                <img className='brands-logo' src={sunbrella}/>
                <img className='brands-logo' src={sauleda}/>
            </div>
        </div>;

    return (<div className='catalog-main-container'>
                <h2>Каталог</h2>
                <img src={banner} className='banner-image'/>
                <div className='catalog-section'>
                    {catalogSection}
                </div>
                {brandsSection}
            </div>);
}

export default Catalog;