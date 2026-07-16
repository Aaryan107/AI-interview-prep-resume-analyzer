import { useContext } from 'react';
import { AuthContext } from '../auth.context';
import { 
    HandleLogin as loginService, 
    HandleRegister as registerService, 
    HandleLogout as logoutService, 
    HandleGetCurrentUser as getCurrentUserService 
} from '../services/auth.api';
import { useEffect } from 'react';
export function useAuth() {
    const context = useContext(AuthContext);
     
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, setUser, loading, setLoading } = context;

    const HandleLogin = async (email, password) => {
        setLoading(true);
        try {
            const data = await loginService(email, password);
            if (data && data.user) {
                setUser(data.user);
            }
            return data;
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const HandleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            const data = await registerService(username, email, password);
            if (data && data.user) {
                setUser(data.user);
            }
            return data;
        } catch (err) {
            console.error("Registration error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const HandleLogout = async () => {
        setLoading(true);
        try {
            await logoutService();
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    }

    const HandleGetCurrentUser = async () => {
        setLoading(true);
        try {
            const data = await getCurrentUserService();
            if (data && data.user) {
                setUser(data.user);
            }
            return data;
        } catch (err) {
            console.error("Get user error:", err);
        } finally {
            setLoading(false);
        }
    }

    return { 
        user, 
        setUser, 
        loading, 
        setLoading, 
        HandleLogin, 
        HandleRegister, 
        HandleLogout, 
        HandleGetCurrentUser 
    };
}
