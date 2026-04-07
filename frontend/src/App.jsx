import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import './index.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = () => {
    setIsLoading(true);
    const apiUrl = `${import.meta.env.VITE_API_URL}/expenses`;
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('API request failed');
        return response.json();
      })
      .then(data => setExpenses(data))
      .catch(error => {
        console.error("Error:", error);
        toast.error('Data lane me gadbad hui!');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = (id) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/expenses/${id}`;
    
    fetch(apiUrl, { method: 'DELETE' })
      .then(res => {
         if (!res.ok) throw new Error('Failed to delete');
         return res.json();
      })
      .then(() => {
        toast.success("Kharcha hamesha ke liye delete ho gaya! 🗑️");
        fetchExpenses();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Delete karne me dikkat aayi!");
      });
  };

  const totalKharcha = expenses.reduce((total, item) => total + Number(item.amount), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#1e1e2f', color: '#fff', padding: '40px 20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      
      <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '40px', letterSpacing: '2px', fontWeight: 'bold' }}>
        💰 MERA DHASU TRACKER
      </h1>

      <div className="main-container" style={{ display: 'flex', gap: '30px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* LEFT PANEL */}
        <div className="left-panel" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ background: 'linear-gradient(135deg, #e14eca 0%, #ba54f5 100%)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: '0.9', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Kharcha</p>
            <h2 style={{ margin: 0, fontSize: '42px' }}>₹{totalKharcha}</h2>
          </div>

          <ExpenseForm 
            onExpenseAdded={fetchExpenses} 
            editData={editData} 
            setEditData={setEditData} 
          />

          <ExpenseChart expenses={expenses} />
        </div>

        {/* RIGHT PANEL */}
        <ExpenseList 
           expenses={expenses} 
           onEdit={(expense) => setEditData(expense)} 
           onDelete={handleDelete} 
           isLoading={isLoading}
        />

      </div>
    </div>
  );
}

export default App;