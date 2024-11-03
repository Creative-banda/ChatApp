import React, { createContext, useEffect, useState } from 'react';
import { ref as databaseRef, update } from 'firebase/database';
import { database } from './config';

export const AppContext = createContext();

export const AppProvider = ({ children, uid }) => {
    const [friendList, setFriendList] = useState([]);
    const [user, setUser] = useState({});
    const userUid = uid;

    const updateStatus = async () => {
        const time = Date.now();
        
        try {
            const userRef = databaseRef(database, `Users/${uid}`);
            await update(userRef, { LastSeen: time });
        } catch (error) {
            console.error("Error updating database: ", error);
        }
    };

    useEffect(() => {
        if (uid) {
            const interval = setInterval(updateStatus, 12000);
            return () => clearInterval(interval);
        }
    }, [uid]);

    return (
        <AppContext.Provider value={{ friendList, setFriendList, user, setUser, userUid }}>
            {children}
        </AppContext.Provider>
    );
};
