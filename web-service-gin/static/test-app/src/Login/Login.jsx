import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const { user, login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        let isSuccess = false;

        if (username) {
            isSuccess = login(username, password);
        }

        setUsername('');
        setPassword('');
        if (isSuccess) {
            navigate('/');
        }
    };

    return (
        <div className="login-screen-container">
            <h2 className="login-title"> Авторизация </h2>
            <div className="login-form-container">
                <form className="login-form" onSubmit={handleLogin}>
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
                        <label className="login-form-label">Пароль</label>
                        <input className="login-form-input"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login-form-element">
                        <button className="login-form-submit" type="submit">Войти</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;