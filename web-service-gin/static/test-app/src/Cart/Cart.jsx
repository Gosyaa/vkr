import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from '../context/CartContext';
import "./Cart.css";
import url from '../data/consts';
import imageStub from '../data/dot.png';

export function Cart() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user === null) {
            navigate('/');
        }
    }, [user]);

    const {cart, clearCart, deleteElement, editQuantity} = useContext(CartContext);

    const emptyCartStub = 
        <div className="empty-cart-stub">
            <h2 className="empty-cart-title">Корзина пуста</h2>
            <div className="shop-button-section">
                <Link to="/catalog"><button className="shop-button">За покупками</button></Link>
            </div>
        </div>
 
    const [cartElement, setCartElement] = useState(emptyCartStub);

    const clearCartHandler = () => {
        clearCart();
    };

    const handleCartDelete = (productId) => {
        deleteElement(productId);
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            deleteElement(productId);
        }
        editQuantity(productId, quantity);
    }

    const getPriceTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        return total;
    }

    const handleOrder = async () => {
        const cartItems = cart.map((item) => ({id: item.product.id, quantity: item.quantity}));
        const fetchURL = url + `/createOrder?accessToken=${token}`
        const formData = new URLSearchParams();
        formData.append("items", JSON.stringify(cartItems))
        try {
            const response = await fetch(fetchURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            })
            if (!response.ok) {
                throw new Error("Update Error");
            } 
            clearCart();
        } catch (error) {
            alert("Не удалось оформить заказ")
        }
    }

    useEffect(() => {
        console.log(cart);
        if (cart.length === 0) {
            setCartElement(emptyCartStub);
        }
        else {
            const cartItems = cart.map((item, index) => 
                <div key={item.id} className="cart-item">
                    <div className="cart-item-left-section">
                        <img className="cart-item-image" src={item.product.image}/>
                        <span className="cart-item-title">{item.product.title}</span>
                    </div>
                    <div className="cart-item-right-side">
                        <div className="cart-item-price-section">
                            <div className="cart-item-quantity-section">
                                <button className='cart-item-quantity-button' onClick={
                                    () => handleUpdateQuantity(item.id, item.quantity - 1)}>
                                -</button>
                                <input  className='cart-item-quantity-field'  type='number' value={item.quantity} onChange={
                                    (e) => handleUpdateQuantity(item.id, Number(e.target.value))}/>
                                <button className='cart-item-quantity-button' onClick={
                                    () => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                +</button>
                            </div>
                            <span className="cart-item-price-total">{item.product.price * item.quantity}&#8381;</span>
                        </div>
                        <button className="cart-item-remove-button" onClick={() => handleCartDelete(item.id)}>Удалить элемент</button>
                    </div>
                </div>
            );
            const displayedCart =
            <div className="cart-element">
                <h2 className="cart-title">Корзина</h2>
                <div className="cart-items">
                    {cartItems}
                </div>
                <div className="cart-total-section">
                    <span className="price-total">Итого: {getPriceTotal()}&#8381;</span>
                    <button className="clear-button" onClick={() => clearCartHandler()}>Очистить корзину</button>
                </div>
                <div className="buy-button-section">
                    <button className="buy-button" onClick={() => handleOrder()}>Оформить</button>
                </div>
            </div>
            setCartElement(displayedCart);
        }
    }, [cart]);

    return (cartElement);
}

export default Cart;