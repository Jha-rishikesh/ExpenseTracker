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

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
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

  const inputStyle = { padding: '12px', background: '#1e1e2f', color: '#fff', border: '1px solid #2b3553', borderRadius: '6px', outline: 'none', fontSize: '15px' };

  return (
    <div style={{ background: '#27293d', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #3b3d54', paddingBottom: '15px', color: '#e14eca', fontSize: '20px' }}>
        {editData ? '✏️ Kharcha Update Karein' : '➕ Naya Kharcha Jodein'}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input type="text" placeholder="Kya kharida? (e.g. Pizza)" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle}/>
        <input type="number" placeholder="Kitne ka? (e.g. 200)" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" required style={inputStyle}/>
        <input type="text" placeholder="Category (e.g. Food)" value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle}/>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle}/>
        
        <button type="submit" disabled={isLoading} style={{ padding: '14px', background: editData ? '#1d8cf8' : '#00f2c3', color: '#1e1e2f', border: 'none', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', transition: '0.3s', opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? 'Wait...' : (editData ? '💾 Update Kharcha' : '➕ Add Kharcha')}
        </button>
        
        {editData && (
           <button type="button" onClick={resetForm} style={{ padding: '12px', background: '#344675', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
             ❌ Cancel
           </button>
        )}
      </form>
    </div>
  );
};

export default ExpenseForm;
