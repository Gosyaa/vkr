import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import '../Login/Login.css';
import './Personal.css';
import { useEffect } from "react";
import items from "../data/items";

export function Personal() {
    const { user, editUser } = useContext(AuthContext);
    const { insertElement }  = useContext(CartContext);

    const [firstName, setFirstName]           = useState(user.firstName);
    const [lastName, setLastName]             = useState(user.lastName);
    const [fatherName, setFatherName]         = useState(user.fatherName);
    const [login, setLogin]                   = useState(user.login);
    const [phone, setPhone]                   = useState(user.phone);
    const [email, setEmail]                   = useState(user.email);
    const [password, setPassword]             = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [username, setUsername] = useState(user.firstName ? user.firstName : user.login);

    useEffect(() => {
        setUsername(user.firstName ? user.firstName : user.login);
    }, [user]);

    const resetUserInfo = () => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setFatherName(user.fatherName);
        setLogin(user.login);
        setPhone(user.phone);
        setEmail(user.email);
        setPassword('');
        setPasswordRepeat('');
    }

    const handlePasswordUpdate = () => {
        if (!password || password !== passwordRepeat) {
            return false;
        }
        return true;
    }

    const handleUserUpdate = (e) => {
        console.log(firstName);
        e.preventDefault();
        if (password || passwordRepeat) {
            const isSuccess = handlePasswordUpdate();
            if (!isSuccess) {
                resetUserInfo();
                alert('Пароли не совпадают');
            }
        }
        editUser({
            login:      login,
            firstName:  firstName,
            lastName:   lastName,
            fatherName: fatherName, 
            phone:      phone,
            email:      email,
            orders:     user.orders
        });
        setPassword('');
        setPasswordRepeat('');
        window.scrollTo(0, 0);
    }

    const repeatOrder = (repeatItems) => {
        repeatItems.forEach((item) => {
            items.items.forEach((itemGeneral) => {
                console.log(item.itemId);
                if (item.itemId === itemGeneral.id) {
                    insertElement(itemGeneral, item.quantity);
                }
            });
        });
    }

    const userInfoForm = 
        <div className="personal-info-container">
            <form className="login-form" onSubmit={handleUserUpdate}>
                    <div className="login-form-element">
                        <label className="login-form-label">Имя</label>
                        <input className="login-form-input"
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}  
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Фамилия</label>
                        <input className="login-form-input"
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}  
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Отчество</label>
                        <input className="login-form-input"
                            type="text" 
                            value={fatherName} 
                            onChange={(e) => setFatherName(e.target.value)}  
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Логин</label>
                        <input className="login-form-input"
                            type="text" 
                            value={login} 
                            onChange={(e) => setLogin(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Электронная почта</label>
                        <input className="login-form-input"
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Номер телефона</label>
                        <input className="login-form-input"
                            type="tel"
                            pattern="\+7\d{10}" 
                            placeholder="+7XXXXXXXXXX"
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Новый пароль</label>
                        <input className="login-form-input"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}  
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Повторить пароль</label>
                        <input className="login-form-input"
                            type="password" 
                            value={passwordRepeat} 
                            onChange={(e) => setPasswordRepeat(e.target.value)}  
                        />
                    </div>
                    <div className="login-form-element">
                        <button className="login-form-submit" type="submit">Обновить профиль</button>
                    </div>
                </form>
        </div>

    const userOrders = user.orders.map((item) =>
        <div className="personal-order" key={item.id}>
            <div className="order-left-section">
                <img className="order-cover" src={item.image}/>
                <div className="order-info-container">
                    <span className="order-title">Заказ №{item.id}</span>
                    <span className="order-title">Статус заказа: {item.status}</span>
                </div>
            </div>
            <div className="order-right-section">
                <span className="order-price">{item.priceTotal}&#8381;</span>
                <button className="order-button" onClick={() => repeatOrder(item.items)}>Повторить заказ</button>
            </div>
        </div>
    );

    return(
        <div className="personal-container">
            <h2 className="personal-title">Добро пожаловать, {username}</h2>
            {userInfoForm}
            <h2 className="personal-title">История заказов</h2>
            <div className="personal-orders">
                {userOrders}
            </div>
        </div>
    );
}

export default Personal;