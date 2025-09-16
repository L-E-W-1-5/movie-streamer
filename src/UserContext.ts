import { createContext } from 'react';


interface User {
    name: string,
    verified: boolean,
    admin: boolean,
};

interface UserContextType {
    user: User | null,
    setUser: (user: User | null) => void
}

const defaultContext: UserContextType = {
    user: null,
    setUser: () => {}
}

export const UserContext = createContext<UserContextType>(defaultContext);