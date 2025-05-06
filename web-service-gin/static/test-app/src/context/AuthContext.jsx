import { createContext, useState, useEffect } from "react";
import { testUser } from "../data/users";
import url from '../data/consts'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getUser = async (token) => {
        if (token === null) {
            return null;
        }
        try {
            let fetchURL = url + `/userByToken?token=${encodeURIComponent(token)}`
            const userResponse = await fetch(fetchURL)
            if (!userResponse.ok) {
                throw new Error("Fetch User Error");
            } 
            const userData = await userResponse.json();
            return userData
        } catch (error) {
            console.error("Login Error", error);
            return null;
        }
    }

    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [user, setUser]   = useState(getUser(token));

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                localStorage.setItem("access_token", token);
                let userData = await getUser(token)
                setUser(userData)
            } 
            else {
                localStorage.removeItem("access_token");
                setUser(null);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (login, password) => {
        try {
            const fetchURL = url + '/checkUser'

            const formData = new URLSearchParams();
            formData.append("login", login);
            formData.append("password", password);

            const response = await fetch(fetchURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            })
            if (!response.ok) {
                throw new Error("Auth Error");
            }

            let tokenResult = await response.json();
            if (!tokenResult) {
                return false;
            }

            setToken(tokenResult.token)
            const userData = await getUser(token) 
            setUser(userData)

            return true;
        } catch (error) {
            console.error("Login Error", error);
            return false;
        }

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