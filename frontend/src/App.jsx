import { useState, useEffect, useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import Authentication from './components/Authentication';
import { useExpenses } from './hooks/useExpenses';
import { AuthContext } from './context/AuthContext';
import './index.css';

function App() {
  const { user, token, logout, isLoading: isAuthLoading } = useContext(AuthContext);
  const { expenses, isLoading: isExpensesLoading, fetchExpenses, deleteExpense } = useExpenses();
  const [editData, setEditData] = useState(null);
  const [monthlyLimit, setMonthlyLimit] = useState(Number(localStorage.getItem('monthlyLimit')) || 50000);

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [fetchExpenses, token]);

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#1e1e2f] text-white">Loading...</div>;
  }

  if (!token) {
    return (
      <>
        <ToastContainer theme="dark" position="top-right" autoClose={3000} />
        <Authentication />
      </>
    );
  }

  const handleUpdateLimit = () => {
    const newLimit = window.prompt("Apna naya Monthly Budget type karo (e.g. 60000):", monthlyLimit);
    if (newLimit && !isNaN(newLimit) && Number(newLimit) > 0) {
       setMonthlyLimit(Number(newLimit));
       localStorage.setItem('monthlyLimit', newLimit);
    }
  };

  const totalKharcha = expenses.reduce((total, item) => total + Number(item.amount), 0);

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white p-6 md:p-10 font-sans">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <h1 className="text-white tracking-widest font-bold text-2xl md:text-4xl m-0">
          💰 MERA DHASU TRACKER
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-[#00f2c3] hidden md:inline">Welcome, {user?.username}</span>
          <button onClick={logout} className="bg-[#fd5d93] px-4 py-2 rounded shadow hover:bg-red-500 transition font-bold cursor-pointer">
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-start">
        
        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          
          <div className="bg-gradient-to-br from-[#e14eca] to-[#ba54f5] p-8 rounded-xl shadow-lg relative overflow-hidden group">
            <p className="m-0 mb-2 text-base opacity-90 uppercase tracking-wider text-center">Total Kharcha</p>
            <h2 className="m-0 text-5xl font-bold text-center">₹{totalKharcha}</h2>
            
            {/* Budget Progress */}
            <div className="mt-6 bg-black/20 rounded-full h-3 w-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-500 ${totalKharcha > monthlyLimit ? 'bg-red-500' : 'bg-[#00f2c3]'}`} 
                 style={{ width: `${Math.min((totalKharcha / monthlyLimit) * 100, 100)}%` }} 
               />
            </div>
            <p className="text-sm mt-2 text-center opacity-80 flex justify-center items-center gap-2">
               Monthly Limit: ₹{monthlyLimit} 
               <button onClick={handleUpdateLimit} className="text-[#00f2c3] hover:text-white cursor-pointer" title="Update Limit">✏️</button>
            </p>
            
            {totalKharcha > monthlyLimit && (
              <div className="absolute top-0 left-0 w-full p-1 bg-red-600 text-white text-xs text-center font-bold animate-pulse">
                BUDGET EXCEEDED! 🚨
              </div>
            )}
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
           onDelete={deleteExpense} 
           isLoading={isExpensesLoading}
        />

      </div>
    </div>
  );
}

export default App;