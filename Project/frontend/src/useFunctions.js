import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useFunctions = () => {
    const API_BASE = 'http://localhost:27879/public';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState({});
    const [backendError, setBackendError] = useState(null);
    const navigate = useNavigate();

    const signin = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            const Data = {
                staff_id: formData.userId,
                password: formData.password,
            };

            try {
                const staffResponse = await axios.post(`${API_BASE}/loginStaffAccount`, Data);
                if (staffResponse.status === 200) {
                    localStorage.setItem('authToken', staffResponse.data.token);
                    navigate('/dashboard');
                    return;
                }
            } catch (staffError) {
                console.warn('Staff login failed, trying teacher route...');
            }

            setError('Login failed. Please check your credentials and try again.');
        } catch (generalError) {
            setError('A network or server error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        try {
            const authToken = localStorage.getItem('authToken');

            if (!authToken) {
                navigate('/login');
                return;
            }

            const response = await axios.post(`${API_BASE}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                localStorage.removeItem('authToken');
                navigate('/');
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            alert('An error occurred during logout. Please try again.');
        }
    };


    return {
        signin,
        logOut,
        setError,
        setLoading,
        setBackendError,
        setFormError,
        API_BASE,
        error,
        loading,
        formError,
        backendError,
        
    };
};
