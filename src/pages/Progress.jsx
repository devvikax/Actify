import useTasks from '../hooks/useTasks';
import ProgressChart from '../components/dashboard/ProgressChart';
import './Dashboard.css'; // Reuse dashboard styles for layout

export default function Progress() {
  const { tasks, loading } = useTasks();

  if (loading) return <div className="page-loading">Loading analytics...</div>;

  return (
    <div className="progress-page" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈 Your Progress</h1>
        <p style={{ color: 'var(--color-text-light)' }}>
          Detailed analytics of your task completion and efficiency.
        </p>
      </header>

      <div style={{ maxWidth: '600px' }}>
        <ProgressChart tasks={tasks} />
      </div>

      <section style={{ marginTop: '3rem' }}>
        <h2>Efficiency Stats</h2>
        <div className="stat-grid" style={{ marginTop: '1rem' }}>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-number">
                {tasks.filter(t => t.status === 'completed').length}
              </span>
              <span className="stat-label">Tasks Finished</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-number">
                {tasks.reduce((acc, t) => acc + (t.completedHours || 0), 0).toFixed(1)}h
              </span>
              <span className="stat-label">Hours Logged</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
