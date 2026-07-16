import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true
})

export async function HandleRegister(username, email, password) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        return response.data
    } catch (err) {
        console.error("API Register Error:", err.response?.data || err.message);
        throw err; // Re-throw so the hook can handle it
    }
}

export async function HandleLogin(email, password) {
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        })
        return response.data
    } catch (err) {
        console.error("API Login Error:", err.response?.data || err.message);
        throw err; // Re-throw so the hook can handle it
    }
}

export async function HandleLogout() {
    try {
        const response = await api.post('/api/auth/logout', {})
        return response.data
    } catch (err) {
        console.error("API Logout Error:", err.response?.data || err.message);
        throw err;
    }
}

export async function HandleGetCurrentUser() {
    try {
        const response = await api.get('/api/auth/get-user')
        return response.data;
    } catch (err) {
        console.error("API Get User Error:", err.response?.data || err.message);
        throw err;
    }
}
