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

    const register = async (newUser) => {
        try {
            const fetchURL = url + '/createUser'

            const formData = new URLSearchParams();
            formData.append("login", newUser.login);
            formData.append("password", newUser.password);
            formData.append("first_name", newUser.firstName)
            formData.append("last_name", newUser.lastName)
            formData.append("father_name", newUser.fatherName)
            formData.append("phone", newUser.phone)
            formData.append("email", newUser.email)

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
            if (response.status == 400) {
                return 400
            }
            let tokenResult = await response.json();
            if (!tokenResult) {
                return 500;
            }

            setToken(tokenResult.token)
            const userData = await getUser(token) 
            setUser(userData)

            return 200
        } catch (error) {
            console.error("Login Error", error);
            return 500;
        }
    }

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const editUser =  async(newUser) => {
        const fetchURL = url + `/updateUser?token=${token}`

        const formData = new URLSearchParams();
        formData.append("login", newUser.login);
        formData.append("password", newUser.password);
        formData.append("first_name", newUser.firstName)
        formData.append("last_name", newUser.lastName)
        formData.append("father_name", newUser.fatherName)
        formData.append("phone", newUser.phone)
        formData.append("email", newUser.email)

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
            const userData = await getUser(token)
            setUser(userData)
            return true
        } catch (error) {
            console.error("Login Error", error);
            return false
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, editUser, register }}>
            {children}
        </AuthContext.Provider>
    );
};