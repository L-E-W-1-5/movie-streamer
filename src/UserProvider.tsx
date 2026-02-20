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

  const [user, setUser] = useState<User | null>(() => {

    const storedUser = sessionStorage.getItem('session_user');

    if(storedUser){

      try{

        return JSON.parse(storedUser);
      
      }catch{

        return null;
      };

    };

    return null;

  }); 

  return (

    <UserContext.Provider value={{user, setUser}}>

        { children }

    </UserContext.Provider>

  );
};