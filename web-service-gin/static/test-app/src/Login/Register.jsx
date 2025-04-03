import { useState } from "react";

function Register() {
    const [firstName, setFirstName]           = useState('');
    const [lastName, setLastName]             = useState('');
    const [fatherName, setFatherName]         = useState('');
    const [username, setUsername]             = useState('');
    const [phone, setPhone]                   = useState('');
    const [email, setEmail]                   = useState('');
    const [password, setPassword]             = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        console.log(password === passwordRepeat);
    };

    return (
        <div className="login-screen-container">
            <h2 className="login-title"> Регистрация </h2>
            <div className="login-form-container">
                <form className="login-form" onSubmit={handleRegister}>
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
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
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
                        <label className="login-form-label">Пароль</label>
                        <input className="login-form-input"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login-form-element">
                        <label className="login-form-label">Повторить пароль</label>
                        <input className="login-form-input"
                            type="password" 
                            value={passwordRepeat} 
                            onChange={(e) => setPasswordRepeat(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login-form-element">
                        <button className="login-form-submit" type="submit">Зарегестрироваться</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;