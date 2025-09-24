import React, { useState, type ReactNode } from 'react';
import { UserContext } from './UserContext'

interface User {
    username: string,
    id: string,
    verified: boolean,
    admin: boolean,
    token: string
};


interface UserProviderProps {
    children: ReactNode
}



export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null); // user state

  return (

    <UserContext.Provider value={{user, setUser}}>

        { children }

    </UserContext.Provider>

  );
};