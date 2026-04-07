const ExpenseList = ({ expenses, onEdit, onDelete, isLoading }) => {
  if (isLoading && expenses.length === 0) {
     return (
        <div style={{ flex: '1.5', background: '#27293d', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ color: '#00f2c3' }}>⏳ Data fetch ho raha hai...</h3>
        </div>
     );
  }

  return (
    <div className="right-panel" style={{ flex: '1.5', background: '#27293d', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #3b3d54', paddingBottom: '15px', color: '#00f2c3', fontSize: '20px' }}>
        📋 Kharche ki List
      </h3>
      <div style={{ maxHeight: '750px', overflowY: 'auto', paddingRight: '5px', marginTop: '20px' }}>
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p style={{ color: '#9a9afb', fontSize: '16px' }}>Abhi tak koi kharcha nahi laya gaya...</p>
            <p style={{ fontSize: '40px', margin: '10px 0' }}>📂</p>
          </div>
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
                  <button onClick={() => onEdit(expense)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px' }} title="Edit">✏️</button>
                  <button onClick={() => onDelete(expense.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '5px' }} title="Delete">❌</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
