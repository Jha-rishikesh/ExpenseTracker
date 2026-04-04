import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [expenses, setExpenses] = useState([]);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null); 

  const fetchExpenses = () => {
    fetch('https://expensetracker-ey6p.onrender.com/expenses')
      .then(response => response.json())
      .then(data => setExpenses(data))
      .catch(error => console.error("Error:", error));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    const expenseData = { title, amount, category, date };

    if (editId === null) {
      fetch('https://expensetracker-ey6p.onrender.com/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      }).then(() => resetFormAndFetch());
    } else {
      fetch(`https://expensetracker-ey6p.onrender.com/expenses/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      }).then(() => resetFormAndFetch());
    }
  };

  const resetFormAndFetch = () => {
    setTitle(''); setAmount(''); setCategory(''); setDate(''); setEditId(null);
    fetchExpenses(); 
  };

  const handleDelete = (id) => {
    fetch(`https://expensetracker-ey6p.onrender.com/expenses/${id}`, { method: 'DELETE' })
    .then(() => fetchExpenses());
  };

  const handleEdit = (expense) => {
    setTitle(expense.title); setAmount(expense.amount); setCategory(expense.category);
    setDate(expense.date.substring(0, 10)); setEditId(expense.id);
  };

  const totalKharcha = expenses.reduce((total, item) => total + Number(item.amount), 0);

  const chartData = expenses.reduce((acc, current) => {
    const existing = acc.find(item => item.name === current.category);
    if(existing) {
      existing.value += Number(current.amount);
    } else {
      acc.push({ name: current.category, value: Number(current.amount) });
    }
    return acc;
  }, []);

  const COLORS = ['#00f2c3', '#1d8cf8', '#ff8d72', '#fd5d93', '#ffc107'];

  const inputStyle = { padding: '12px', background: '#1e1e2f', color: '#fff', border: '1px solid #2b3553', borderRadius: '6px', outline: 'none', fontSize: '15px' };

  return (
    <div style={{ minHeight: '100vh', background: '#1e1e2f', color: '#fff', padding: '40px 20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '40px', letterSpacing: '2px', fontWeight: 'bold' }}>
        💰 MERA DHASU TRACKER
      </h1>

      <div style={{ display: 'flex', gap: '30px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* LEFT PANEL: Total, Form & Chart */}
        <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ background: 'linear-gradient(135deg, #e14eca 0%, #ba54f5 100%)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: '0.9', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Kharcha</p>
            <h2 style={{ margin: 0, fontSize: '42px' }}>₹{totalKharcha}</h2>
          </div>

          {/* 🔥 FORM KO UPAR SHIFT KIYA HAI */}
          <div style={{ background: '#27293d', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #3b3d54', paddingBottom: '15px', color: '#e14eca', fontSize: '20px' }}>
              {editId ? '✏️ Kharcha Update Karein' : '➕ Naya Kharcha Jodein'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <input type="text" placeholder="Kya kharida? (e.g. Pizza)" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle}/>
              <input type="number" placeholder="Kitne ka? (e.g. 200)" value={amount} onChange={(e) => setAmount(e.target.value)} required style={inputStyle}/>
              <input type="text" placeholder="Category (e.g. Food)" value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle}/>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle}/>
              
              <button type="submit" style={{ padding: '14px', background: editId ? '#1d8cf8' : '#00f2c3', color: '#1e1e2f', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', transition: '0.3s' }}>
                {editId ? '💾 Update Kharcha' : '➕ Add Kharcha'}
              </button>
              
              {editId && (
                 <button type="button" onClick={resetFormAndFetch} style={{ padding: '12px', background: '#344675', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                   ❌ Cancel
                 </button>
              )}
            </form>
          </div>

          {/* 🔥 PIE CHART KO NICHE SHIFT KIYA HAI */}
          {expenses.length > 0 && (
            <div style={{ background: '#27293d', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', height: '320px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginTop: 0, textAlign: 'center', color: '#fff', fontSize: '16px', marginBottom: '10px' }}>Kharcha by Category</h3>
              
              <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="45%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: List */}
        <div style={{ flex: '1.5', minWidth: '400px', background: '#27293d', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #3b3d54', paddingBottom: '15px', color: '#00f2c3', fontSize: '20px' }}>
            📋 Kharche ki List
          </h3>
          
          <div style={{ maxHeight: '750px', overflowY: 'auto', paddingRight: '5px', marginTop: '20px' }}>
            {expenses.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9a9afb', marginTop: '50px', fontSize: '16px' }}>Abhi tak koi kharcha nahi laya gaya...</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {expenses.map((expense) => (
                  <li key={expense.id} style={{ background: '#1e1e2f', padding: '20px', marginBottom: '15px', borderRadius: '8px', borderLeft: '4px solid #1d8cf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '18px', color: '#fff', letterSpacing: '0.5px' }}>{expense.title}</strong> <br/>
                      <small style={{ color: '#9a9afb', fontSize: '13px', display: 'inline-block', marginTop: '5px' }}>{expense.category} | {expense.date.substring(0, 10)}</small>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#00f2c3' }}>₹{expense.amount}</span>
                      <button onClick={() => handleEdit(expense)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px', transition: 'transform 0.2s' }} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(expense.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px' }} title="Delete">❌</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;