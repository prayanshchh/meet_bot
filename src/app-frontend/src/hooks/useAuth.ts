    import {useState, useEffect} from 'react'
    import axios from 'axios';

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
            axios.get('http://127.0.0.1:8000/me', {withCredentials: true })
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
            await axios.get('http://127.0.0.1:8000/logout', { withCredentials: true });
            setUser(null);
        };

        return {
            user,
            isLoggedIn: !!user,
            isLoading,
            logout,
        };
    }
