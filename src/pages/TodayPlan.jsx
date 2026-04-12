import { useSchedule } from '../hooks/useSchedule';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import './TodayPlan.css';

export default function TodayPlan() {
  const { todaysTasks, loading: scheduleLoading } = useSchedule();
  const { logProgress, loading: tasksLoading } = useTasks();

  const handleCompleteMicroTask = async (microTask) => {
    try {
      // microTask has plannedHours and parentId (the task object is spread into it)
      await logProgress(microTask, microTask.plannedHours);
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  if (scheduleLoading || tasksLoading) {
    return <div className="page-loading">Generating your plan... 🤖</div>;
  }

  return (
    <div className="today-plan">
      <header className="today-header">
        <h2 className="today-title">📅 Today's Focus</h2>
        <div className="today-summary-badge">
          ⏱ Total: {todaysTasks.reduce((sum, t) => sum + t.plannedHours, 0).toFixed(1)}h
        </div>
        <p className="today-subtitle">
          AI breakdown based on your study capacity. Finish these to stay on track!
        </p>
      </header>

      {todaysTasks.length === 0 ? (
        <div className="today-empty">
          <div className="today-empty-icon">✨</div>
          <h3>All clear for today!</h3>
          <p>No tasks scheduled. Relax or add more tasks to get ahead.</p>
        </div>
      ) : (
        <div className="today-list">
          {todaysTasks.map((microTask) => (
            <div key={microTask.microId} className="today-item">
              <TaskCard 
                task={{
                  ...microTask,
                  name: microTask.title, // Override name with micro-task title
                  estimatedHours: microTask.plannedHours, // Show planned hours for this chunk
                  status: 'pending' // Force pending since it's in the list
                }}
                onComplete={() => handleCompleteMicroTask(microTask)}
                // We disable edit/delete for micro-tasks in this view for safety
                onEdit={() => {}} 
                onDelete={() => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
