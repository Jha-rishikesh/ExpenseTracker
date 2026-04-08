import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const useExpenses = () => {
  const { token, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, [token]);

  const fetchExpenses = useCallback(() => {
    if (!token) return;
    setIsLoading(true);
    const apiUrl = `${import.meta.env.VITE_API_URL}/expenses`;
    
    fetch(apiUrl, { headers: getHeaders() })
      .then(response => {
        if (response.status === 401) { logout(); throw new Error('Unauthorized'); }
        if (!response.ok) throw new Error('API request failed');
        return response.json();
      })
      .then(data => setExpenses(data))
      .catch(error => {
        if (error.message !== 'Unauthorized') {
           console.error("Error:", error);
           toast.error('Data lane me gadbad hui!');
        }
      })
      .finally(() => setIsLoading(false));
  }, [token, getHeaders, logout]);

  const deleteExpense = (id) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/expenses/${id}`;
    
    fetch(apiUrl, { method: 'DELETE', headers: getHeaders() })
      .then(res => {
         if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
         if (!res.ok) throw new Error('Failed to delete');
         return res.json();
      })
      .then(() => {
        toast.success("Kharcha hamesha ke liye delete ho gaya! 🗑️");
        fetchExpenses();
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') {
          console.error(err);
          toast.error("Delete karne me dikkat aayi!");
        }
      });
  };

  return { expenses, isLoading, fetchExpenses, deleteExpense, getHeaders };
};
