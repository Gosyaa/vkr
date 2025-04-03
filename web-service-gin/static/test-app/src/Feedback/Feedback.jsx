import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import './Feedback.css';

export function Feedback() {
    const { user } = useContext(AuthContext);
    const [name, setName]       = useState(user ? user.firstName : '');
    const [email, setEmail]     = useState(user ? user.email : '');
    const [message, setMessage] = useState('');

    return(
        <div className="feedback-container">
            <div className="feedback-text-container">
                <h2 className="feedback-title">Помощь</h2>
                <p className="feedback-text">Вы находитесь в разделе помощь покупателю. Вы можете задать любой ваш вопрос по телефону
                     <a className="phone-link" href='tel:+79272229423' target="_blank"> +79272229423 </a>
                или электронной почте <a href="mailto:yaroslav_shkoda@mail.ru" className="email-link">yaroslav_shkoda@mail.ru</a></p>
                <p className="feedback-text">Также Вы можете воспользоваться формой ниже, чтобы связаться с нами:</p>
            </div>
            <h2 className="feedback-form-title">Обратная связь</h2>
            <div className="feedback-form-container">
                <form className="feedback-form">
                    <div className="feedback-form-item">
                        <label    className="feedback-name-label  feedback-label"> Ваше имя </label>
                        <input    className="feedback-name-input  feedback-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                    </div>
                    <div className="feedback-form-item">
                        <label    className="feedback-email-label feedback-label">Ваш E-mail</label>
                        <input    className="feedback-email-input feedback-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required/>
                    </div>
                    <div className="feedback-form-item">
                        <label    className="feedback-text-label  feedback-label">Сообщение </label>
                        <textarea className="feedback-text-input  feedback-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required/>
                    </div>
                    <div className="feedback-form-item">
                        <input    className="feedback-submit" type="submit"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Feedback;