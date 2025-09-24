import { createContext } from 'react';


interface User {
    username: string,
    verified: boolean,
    id: string,
    admin: boolean,
    token: string
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