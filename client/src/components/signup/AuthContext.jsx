import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
    isAuthenticated: false,
    userProfile: null,
    userID: null,
    login: () => {},
    logout: () => {},
    updateUserProfile: () => {},
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setUserProfile(parsedUser);
            console.log("this is profile in UseEffect: ", storedUser)
            setUserID(parsedUser._id); 
        } else {
            setIsAuthenticated(false);
            setUserProfile(null);
            setUserID(null);
        }
        setLoading(false);
    }, []);

    const login = (token, profile) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ username: profile.username, _id: profile._id })); // Include _id in stored user data
        setIsAuthenticated(true);
        setUserProfile(profile);
        setUserID(profile._id);
        navigate('/home');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUserProfile(null);
        setUserID(null);
        navigate('/login');
    };

    const updateUserProfile = (profile) => {
        localStorage.setItem('user', JSON.stringify(profile));
        console.log("This is the profile paramter from UpdateUserProfile: ", profile)
        setUserProfile(profile);
        setUserID(profile._id); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userProfile, userID, login, logout, updateUserProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
