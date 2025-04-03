import PropTypes from 'prop-types';
import { useLocation } from "react-router-dom";
import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Item.css';

export function Item() {
    const location = useLocation();
    const item = location.state.item;

    const { insertElement } = useContext(CartContext);

    const [quantity, setQuantity] = useState(1);
    const updateQuantity = (newQuantity) => {
        newQuantity = Math.max(newQuantity, 1);
        setQuantity(newQuantity);
    }

    const allImages = [item.image, ...item.extraImages];

    const [focusImageIndex, setFocusImageIndex] = useState(0);

    const handleThumbnailClick = (i) => {
        setFocusImageIndex(i);
    };

    const propertiesToRender = item.properties.filter((property) => (property.propertyName && property.propertyValue));
    const propertiesElement = propertiesToRender.map((property, index) => 
        <div key={index} className='item-property-element'>
            <div className="item-property-label">{property.propertyName}</div>
            <div className="item-property-value">{property.propertyValue}</div>
        </div>
    );
    const propertiesContainer = propertiesElement.length === 0 ? 
        <div className='item-properties-container'></div> : 
        <div className='item-properties-container'>
            <span className='item-bottom-header'>Характеристики</span>
            {propertiesElement}
        </div>
    
    return (
        <div className='item-container'>
            <div className='item'>
                <div className='item-upper-section'>
                    <img className='item-image' src={allImages[focusImageIndex]} alt={item.title} />
                    <div className='item-right-section'>
                        <span className='item-title'>{item.title}</span>
                        <div className='item-price-section'>
                            <span className='item-price'>{item.price}&#8381;</span>
                            <div className='item-buy-section'>
                                <div className='item-quantity-section'>
                                    <button className='item-quantity-button' onClick={() => updateQuantity(quantity - 1)}>-</button>
                                    <input className='item-quantity-field' type='number' value={quantity} onChange={(e) => updateQuantity(Number(e.target.value))} />
                                    <button className='item-quantity-button' onClick={() => updateQuantity(quantity + 1)}>+</button>
                                </div>
                                <button className='item-buy-button' onClick={() => insertElement(item, quantity)}>В корзину</button>
                            </div>
                        </div>
                    </div> 
                </div>
                <div className='item-thumbnails'>
                    {allImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index}`}
                            className={`thumbnail ${focusImageIndex === index ? 'thumbnail-active' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        />
                    ))}
                </div>
                <div className='item-bottom-section'>
                    <span className='item-bottom-header'>Описание</span>
                    <span className='item-description'>{item.description}</span>
                    {propertiesContainer}
                </div>
            </div>
        </div>
    );
}

Item.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            item: PropTypes.shape({
                id: PropTypes.number.isRequired,
                categoryId: PropTypes.number.isRequired,
                title: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                image: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
                properties: PropTypes.array.isRequired,
                extraImages: PropTypes.arrayOf(PropTypes.string).isRequired,
            }),
        }),
    }),
};

export default Item;