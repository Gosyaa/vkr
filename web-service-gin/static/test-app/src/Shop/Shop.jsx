import PropTypes from 'prop-types'
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import url from '../data/consts'
import './Shop.css'

export function Shop() {
    window.scroll(0, 0);
    const location = useLocation();
    const categoryTitle = location.state.catalogItem.title;
    const categoryId    = location.state.catalogItem.id;

    const navigate = useNavigate();

    const [itemsToDisplay, setItemsToDisplay] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
          try {
            let fetchURL = url + `/items?categoryId=${categoryId}`;
            const response = await fetch(fetchURL);
            if (!response.ok) {
              throw new Error(`Ошибка: ${response.status}`);
            }
            let data = await response.json();
            if (data === null) {
                data = [];
            }
            setItemsToDisplay(data);
            setQuantities(data.map(() => 1));
          } catch (error) {
            console.error('Ошибка при получении данных:', error);
          }
        };
    
        fetchItems();
      }, [categoryId]);

    const {insertElement} = useContext(CartContext);
    const {user}          = useContext(AuthContext);

    const [quantities, setQuantities] = useState(
        itemsToDisplay.map(() => 1)
    );

    console.log(itemsToDisplay);
    console.log(quantities);

    const updateQuantity = (index, value) => {
        value = Math.max(1, value);
        setQuantities(prevQuantities =>
            prevQuantities.map((q, i) => (i === index ? value : q))
        );
    };

    const handleAddToCart = (index) => {
        if (user !== null) {
            insertElement(itemsToDisplay[index], quantities[index]);
            updateQuantity(index, 1);
        }
        else {
            navigate('/login')
        }
    };

    const shopSection = itemsToDisplay.map((item, index) =>
        <div key={item.id} className='shop-item-container'>
            <div className='shop-item'>
                <Link key={item.id} to="/item" state={{ item: item }}>
                    <img  className='shop-item-image' src={item.image}/>
                </Link>
                <div className='item-data-container'>
                    <div className='upper-item-data'>
                        <div className='title-container'>
                            <Link key={item.id} to="/item" state={{ item: item }}>
                                <div className='shop-item-title-container'>
                                    <span className='shop-item-title'>{item.title}</span>
                                </div>
                            </Link>
                        </div>
                        <span className='shop-item-price'>{item.price}&#8381;</span>
                    </div>
                    <div className='lower-item-data'>
                        <div  className='shop-item-buy-section'>
                            <div className='shop-item-quantity-section'>
                                <button className='quantity-button' onClick={() => updateQuantity(index, quantities[index] - 1)}>-</button>
                                <input  className='quantity-field'  type='number' value={quantities[index]} onChange={(e) => updateQuantity(index, Number(e.target.value))}/>
                                <button className='quantity-button' onClick={() => updateQuantity(index, quantities[index] + 1)}>+</button>
                            </div>
                            <button className='add-item-button' onClick={() => handleAddToCart(index)}>Купить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


    return(
        <>
            <h2  className='shop-category-title'>{categoryTitle}</h2>
            <div className='shop-items-section' >{shopSection}  </div>
        </>
    );
}

Shop.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            catalogItem: PropTypes.shape({
                id:    PropTypes.number,
                title: PropTypes.string.isRequired,
                image: PropTypes.string,
            }),
        }),
    }),
};