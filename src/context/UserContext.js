import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        name: 'Tharamac User',
        businessName: 'Digital Marketer',
        phone: '9876543210',
        email: 'user@tharamac.com',
        profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80'
    });

    const [isDarkMode, setIsDarkMode] = useState(false);

    // Dynamic Theme Object
    const theme = isDarkMode ? {
        mode: 'dark',
        background: '#121212',
        surface: '#1E1E1E',
        text: '#FFFFFF',
        textLight: '#AAAAAA',
        primary: '#FF3B30',
        border: '#333333',
        inputBg: '#2C2C2C',
        statusBarStyle: 'light-content'
    } : {
        mode: 'light',
        background: '#F9F9F9',
        surface: '#FFFFFF',
        text: '#1F2937',
        textLight: '#9CA3AF',
        primary: '#FF3B30',
        border: '#E5E7EB',
        inputBg: '#FFFFFF',
        statusBarStyle: 'dark-content'
    };

    return (
        <UserContext.Provider value={{ userData, setUserData, isDarkMode, setIsDarkMode, theme }}>
            {children}
        </UserContext.Provider>
    );
};