import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseChart = ({ expenses }) => {
  if (expenses.length === 0) return null;

  const chartData = expenses.reduce((acc, current) => {
    const existing = acc.find(item => item.name === current.category);
    if(existing) {
      existing.value += Number(current.amount);
    } else {
      acc.push({ name: current.category, value: Number(current.amount) });
    }
    return acc;
  }, []);

  const COLORS = ['#00f2c3', '#1d8cf8', '#ff8d72', '#fd5d93', '#ffc107', '#bc8f8f', '#6495ed'];

  return (
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
  );
};

export default ExpenseChart;
