import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import url from '../data/consts'

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const insertElement = async (product, quantity) => {
        try {
            const productId = product.id
            const fetchURL = url + `/item?itemId=${productId}`
            const response = await fetch(fetchURL);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            let data = await response.json();
            if (data != null) {
                product = data
            }
        } catch (error) {
            console.error('Error fetching item:', error);
        }


        const productIndex = cart.findIndex(element => element.product.id === product.id);
        if (productIndex !== -1) {
            setCart((prevCart) => {
                const replacedElement = prevCart[productIndex]
                if (replacedElement.quantity + quantity <= product.available) {
                    prevCart[productIndex] = {
                        id:       replacedElement.id,
                        product:  replacedElement.product,
                        quantity: replacedElement.quantity += quantity
                    };
                }
                else {
                    alert("Не хватает товара " + product.title +  " на складе. Текущее наличие: " + (product.available - replacedElement.quantity));
                }
                return prevCart;
            })
        }
        else {
            if (quantity <= product.available) {
                const id = Math.random();
                const cartElement = {
                    id:       id,
                    product:  product,
                    quantity: quantity
                };

                setCart((prevCart) => [...prevCart, cartElement]);
            }
            else {
                alert("Не хватает товара " + product.title + " на складе. Текущее наличие: " + product.available);
            }
        }
    };

    const deleteElement = (productId) => {
        setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
    };

    const editQuantity = (productId, quantity) => {
        console.log(cart);
        console.log(productId, quantity);
        setCart((prevCart) => 
            prevCart.map((product) =>
                product.id === productId 
                    ? { ...product, quantity: quantity }
                    : product
            )
        );
        console.log(cart);
    }

    const clearCart = () => {
        setCart([]);
    }

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(cart);
    }, [cart]);

    useEffect(() => {
        if (user === null) {
            clearCart();
        }
    }, [user]);

    return (
        <CartContext.Provider value={{ cart, insertElement, deleteElement, editQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};