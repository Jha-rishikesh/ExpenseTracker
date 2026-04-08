import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ExpenseForm = ({ onExpenseAdded, editData, setEditData }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setAmount(editData.amount);
      setCategory(editData.category);
      setDate(editData.date.substring(0, 10));
    }
  }, [editData]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
    setEditData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (Number(amount) <= 0) {
      toast.error('Amount 0 se bada hona chahiye!');
      return;
    }

    const expenseData = { title, amount, category, date };
    const apiUrl = `${import.meta.env.VITE_API_URL}/expenses`;
    setIsLoading(true);

    const method = editData ? 'PUT' : 'POST';
    const url = editData ? `${apiUrl}/${editData.id}` : apiUrl;

    const token = localStorage.getItem('token');

    fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(expenseData)
    })
    .then(res => {
      if (!res.ok) throw new Error('API failed');
      return res.json();
    })
    .then(() => {
      toast.success(editData ? 'Kharcha update ho gaya! ✏️' : 'Naya kharcha add ho gaya! 🚀');
      resetForm();
      onExpenseAdded(); 
    })
    .catch((err) => {
      console.error(err);
      toast.error('Galti se mistake ho gayi, please try again.');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const inputClass = "p-3 bg-[#1e1e2f] text-white border border-[#2b3553] rounded-md outline-none text-[15px] focus:border-[#e14eca] transition-colors w-full";

  return (
    <div className="bg-[#27293d] p-6 rounded-xl shadow-lg">
      <h3 className="mt-0 border-b border-[#3b3d54] pb-4 text-[#e14eca] text-xl font-semibold">
        {editData ? '✏️ Kharcha Update Karein' : '➕ Naya Kharcha Jodein'}
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
        <input type="text" placeholder="Kya kharida? (e.g. Pizza)" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
        <input type="number" placeholder="Kitne ka? (e.g. 200)" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" required className={inputClass} />
        <input type="text" placeholder="Category (e.g. Food)" value={category} onChange={(e) => setCategory(e.target.value)} required className={inputClass} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        
        <button 
          type="submit" 
          disabled={isLoading} 
          className={`p-3.5 mt-2 rounded-md font-bold text-base transition-all duration-300 ${
            editData ? 'bg-[#1d8cf8] text-white hover:bg-blue-600' : 'bg-[#00f2c3] text-[#1e1e2f] hover:bg-teal-400'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isLoading ? 'Wait...' : (editData ? '💾 Update Kharcha' : '➕ Add Kharcha')}
        </button>
        
        {editData && (
           <button 
            type="button" 
            onClick={resetForm} 
            className="p-3 bg-[#344675] text-white rounded-md hover:bg-slate-600 cursor-pointer transition-colors"
           >
             ❌ Cancel
           </button>
        )}
      </form>
    </div>
  );
};

export default ExpenseForm;
