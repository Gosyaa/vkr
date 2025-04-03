import { createContext, useState, useEffect } from "react";
import { testUser } from "../data/users";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getUser = (token) => {
        if (token === null) {
            return null;
        }
        return testUser;
    }

    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [user, setUser]   = useState(getUser(token));

    useEffect(() => {
        if (token) {
            localStorage.setItem("access_token", token);
            setUser(getUser(token));
        } 
        else {
            localStorage.removeItem("access_token");
            setUser(null);
        }
    }, [token]);

    const login = (login, password) => {
        let fakeToken = null;
        if (password) {
            fakeToken = login;
        }
        setToken(fakeToken);
        setUser(getUser(token));
        return fakeToken !== null;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const editUser = (newUser) => {
        console.log(user);
        setUser(newUser);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, editUser }}>
            {children}
        </AuthContext.Provider>
    );
};