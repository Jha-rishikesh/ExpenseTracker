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
    <div className="bg-[#27293d] p-5 rounded-xl shadow-lg h-[320px] flex flex-col">
      <h3 className="mt-0 text-center text-white text-base mb-2.5 font-semibold tracking-wide">Kharcha by Category</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="45%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `₹${value}`} 
              contentStyle={{ backgroundColor: '#1e1e2f', border: 'none', borderRadius: '8px', color: '#fff' }} 
            />
            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
