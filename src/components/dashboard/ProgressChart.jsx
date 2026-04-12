import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import './ProgressChart.css';

/**
 * ProgressChart — Minimalist Soft Brutalist chart for Dashboard.
 */
export default function ProgressChart({ tasks = [] }) {
  if (!tasks.length) return null;

  // Calculate stats
  const totalHours = tasks.reduce((sum, t) => sum + (parseFloat(t.estimatedHours) || 0), 0);
  const completedHours = tasks.reduce((sum, t) => {
    if (t.status === 'completed') return sum + (parseFloat(t.estimatedHours) || 0);
    return sum + (parseFloat(t.completedHours) || 0);
  }, 0);

  const completionRate = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
  
  const data = [
    { name: 'Completed', value: completedHours, color: '#9dffb0' }, // Mint Green
    { name: 'Remaining', value: totalHours - completedHours, color: '#fef3c7' }, // Cream Yellow
  ];

  return (
    <div className="progress-chart-container">
      <div className="progress-chart-header">
        <h3 className="progress-chart-title">Overall Progress</h3>
        <div className="progress-chart-percentage">
          <span className="percentage-number">{completionRate}%</span>
          <span className="percentage-label">done</span>
        </div>
      </div>

      <div className="progress-chart-visual">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="#000"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '3px solid #000', 
                borderRadius: '8px',
                fontWeight: 'bold'
              }} 
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="progress-chart-footer">
        <p className="progress-chart-stats">
          <strong>{completedHours.toFixed(1)}h</strong> of <strong>{totalHours.toFixed(1)}h</strong> completed
        </p>
      </div>
    </div>
  );
}
