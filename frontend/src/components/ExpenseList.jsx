import { useState, useMemo } from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete, isLoading }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');

  // Derive unique categories for the filter dropdown
  const categories = useMemo(() => {
    const cats = expenses.map(e => e.category);
    return [...new Set(cats)];
  }, [expenses]);

  // Apply filters and sorting
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Search filter
    if (search) {
      result = result.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter(e => e.category === categoryFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortOption === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortOption === 'amount-desc') return Number(b.amount) - Number(a.amount);
      if (sortOption === 'amount-asc') return Number(a.amount) - Number(b.amount);
      return 0;
    });

    return result;
  }, [expenses, search, categoryFilter, sortOption]);

  const handleExportCSV = () => {
    if (filteredAndSortedExpenses.length === 0) return;
    
    const headers = ['Title,Amount,Category,Date'];
    const rows = filteredAndSortedExpenses.map(e => 
      `${e.title},${e.amount},${e.category},${e.date.substring(0, 10)}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading && expenses.length === 0) {
     return (
        <div className="flex-[1.5] bg-[#27293d] p-6 rounded-xl text-center">
          <h3 className="text-[#00f2c3] text-xl">⏳ Data fetch ho raha hai...</h3>
        </div>
     );
  }

  const inputClass = "p-2 bg-[#1e1e2f] text-white border border-[#3b3d54] rounded-md outline-none focus:border-[#00f2c3] transition";

  return (
    <div className="w-full flex-[1.5] bg-[#27293d] p-6 rounded-xl shadow-lg flex flex-col">
      <div className="flex flex-wrap justify-between items-center border-b border-[#3b3d54] pb-4 mb-4 gap-4">
        <h3 className="m-0 text-[#00f2c3] text-xl font-semibold">
          📋 Kharche ki List
        </h3>
        <button 
          onClick={handleExportCSV} 
          className="bg-[#1d8cf8] text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition"
          disabled={filteredAndSortedExpenses.length === 0}
        >
          📥 Export CSV
        </button>
      </div>

      {/* Control Panel (Filters & Sort) */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input 
          type="text" 
          placeholder="🔎 Search kharcha..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 min-w-[150px] ${inputClass}`}
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={inputClass}
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          className={inputClass}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      <div className="max-h-[650px] overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-[#1d8cf8]">
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-[#9a9afb] text-base">Koi record nahi mila...</p>
            <p className="text-4xl my-2">📂</p>
          </div>
        ) : (
          <ul className="list-none p-0 m-0">
            {filteredAndSortedExpenses.map((expense) => (
              <li key={expense.id} className="bg-[#1e1e2f] p-5 mb-4 rounded-lg border-l-4 border-l-[#1d8cf8] flex justify-between items-center transition-transform hover:-translate-y-1 hover:shadow-md">
                <div>
                  <strong className="text-lg text-white tracking-wide">{expense.title}</strong> <br/>
                  <small className="text-[#9a9afb] text-[13px] inline-block mt-1">{expense.category} | {expense.date.substring(0, 10)}</small>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-2xl font-bold text-[#00f2c3]">₹{expense.amount}</span>
                   <button onClick={() => onEdit(expense)} className="bg-transparent border-none cursor-pointer text-xl p-1 hover:scale-110 transition-transform" title="Edit">✏️</button>
                   <button onClick={() => onDelete(expense.id)} className="bg-transparent border-none cursor-pointer text-xl p-1 hover:scale-110 transition-transform" title="Delete">❌</button>
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
