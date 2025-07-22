    import {useState, useEffect} from 'react'
    import api from '../api';

    interface User {
        id: string;
        email: string;
        name: string;
        provider: string;
    }

    export function useAuth() {
        const [user, setUser] = useState<User | null>(null)
        const [isLoading, setIsLoading] = useState(true)

        useEffect(()=> {
            api
            .get('/me', { withCredentials: true })
            .then(res=> {
                setUser(res.data);
            })
            .catch(()=> {
                setUser(null)
            })
            .finally(()=> {
                setIsLoading(false)
            })
        }, [])

        const logout = async () => {
            await api.get('/logout', { withCredentials: true });
            setUser(null);
        };

        return {
            user,
            isLoggedIn: !!user,
            isLoading,
            logout,
        };
    }
