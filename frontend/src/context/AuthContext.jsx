import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            setUser({ username: localStorage.getItem('username') });
        }
        setIsLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                setToken(data.token);
                setUser({ username: data.username });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.error);
                return false;
            }
        } catch (error) {
            toast.error("Login failed due to server error.");
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(data.message + " Ab login kar lo.");
                return true;
            } else {
                toast.error(data.error);
                return false;
            }
        } catch (error) {
            toast.error("Registration failed due to server error.");
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        toast.info("Logged out!");
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
