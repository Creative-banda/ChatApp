import React, { createContext, useEffect } from 'react';
import { ref as databaseRef, update } from 'firebase/database';
import { database } from './config';

export const AppContext = createContext();

export const AppProvider = ({ children, uid }) => {

    const updateStatus = async () => {
        time = Date.now()
        
        try {
            const userRef = databaseRef(database, `Users/${uid}`);
            await update(userRef, { LastSeen: time });
        } catch (error) {
            console.error("Error updating database: ", error);
        }
    };

    useEffect(() => {
        if (uid) {
            const interval = setInterval(updateStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [uid]);

    return (
        <AppContext.Provider value={{}}>
            {children}
        </AppContext.Provider>
    );
};
