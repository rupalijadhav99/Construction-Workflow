import React, { useContext } from "react";
import { WorkflowContext } from "../contexts/WorkflowContext";
import { AuthContext } from "../contexts/AuthContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const statusOptions = ["pending", "in progress", "completed"];
const COLORS = ['#fbc02d', '#1976d2', '#43a047'];

const Dashboard = ({ contractorView, clientView }) => {
  const { user } = useContext(AuthContext);
  const { stages, updateStage, removeStage } = useContext(WorkflowContext);

  const filteredStages = contractorView 
    ? stages.filter(stage => {
        const isAssignedToMe = stage.contractor === user.name;
        const isUnassigned = !stage.contractor || stage.contractor === "";
        return isAssignedToMe || isUnassigned;
      })
    : stages;

  const displayStages = filteredStages;

  const totalBudget = displayStages.reduce((sum, s) => sum + Number(s.budget || 0), 0);
  const totalDuration = displayStages.reduce((sum, s) => sum + Number(s.duration || 0), 0);
  const completed = displayStages.filter(s => s.status === "completed").length;
  const inProgress = displayStages.filter(s => s.status === "in progress").length;
  const pending = displayStages.filter(s => s.status === "pending").length;
  const percent = displayStages.length ? Math.round((completed / displayStages.length) * 100) : 0;

  const handleStatusChange = (index, value) => {
    const actualIndex = stages.findIndex(stage => stage.id === displayStages[index].id);
    const updates = { 
      status: value,
      ...(value === 'completed' && { completedAt: new Date().toISOString() })
    };
    updateStage(actualIndex, updates);
  };

  const barData = displayStages.map(stage => ({
    name: stage.name || `Stage ${displayStages.indexOf(stage) + 1}`,
    duration: Number(stage.duration || 0),
    budget: Number(stage.budget || 0),
  }));

  const pieData = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Completed', value: completed },
  ].filter(item => item.value > 0);

  const contractorStats = displayStages.reduce((acc, stage) => {
    const contractor = stage.contractor || 'Unassigned';
    if (!acc[contractor]) {
      acc[contractor] = { count: 0, budget: 0, completed: 0 };
    }
    acc[contractor].count++;
    acc[contractor].budget += Number(stage.budget || 0);
    if (stage.status === 'completed') acc[contractor].completed++;
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>
          {contractorView ? `My Assignments (${user.name})` : 
           clientView ? 'Project Overview' : 
           'Project Dashboard'}
        </h2>
      </div>


      <div className="dashboard-summary">
        <div className="summary-grid">
          <div className="summary-card">
            <h3>{contractorView ? 'My Budget' : 'Total Budget'}</h3>
            <p>₹{totalBudget.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h3>{contractorView ? 'My Duration' : 'Total Duration'}</h3>
            <p>{totalDuration} days</p>
          </div>
          <div className="summary-card">
            <h3>Completion</h3>
            <p>{percent}% ({completed}/{displayStages.length})</p>
          </div>
          <div className="summary-card">
            <h3>{contractorView ? 'My Stages' : 'Active Stages'}</h3>
            <p>{inProgress} in progress, {pending} pending</p>
          </div>
        </div>
      </div>

      {displayStages.length > 0 && (
        <div className="charts-container">
          <div className="chart-item">
            <h3>Stage Progress Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-item">
            <h3>Duration & Budget by Stage</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#8884d8" name="Duration (days)" />
                <Bar dataKey="budget" fill="#82ca9d" name="Budget (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!contractorView && displayStages.length > 0 && (
        <div className="contractor-stats">
          <h3>Contractor Performance</h3>
          <table className="contractor-table">
            <thead>
              <tr>
                <th>Contractor</th>
                <th>Stages</th>
                <th>Total Budget</th>
                <th>Completed</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(contractorStats).map(([contractor, stats]) => (
                <tr key={contractor}>
                  <td>{contractor}</td>
                  <td>{stats.count}</td>
                  <td>₹{stats.budget.toLocaleString()}</td>
                  <td>{stats.completed}</td>
                  <td>{stats.count > 0 ? Math.round((stats.completed / stats.count) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Stage Name</th>
            <th>Contractor</th>
            <th>Duration (days)</th>
            <th>Budget (₹)</th>
            <th>Status</th>
            {!clientView && <th>Media</th>}
            {!clientView && !contractorView && <th>Remove</th>}
          </tr>
        </thead>
        <tbody>
          {displayStages.length === 0 && (
            <tr>
              <td colSpan={clientView ? "5" : contractorView ? "6" : "7"} className="no-stage">
                {contractorView ? 
                  'No stages assigned to you yet. Ask admin to assign stages or create new ones.' : 
                  'No stages added yet.'}
              </td>
            </tr>
          )}
          {displayStages.map((stage, i) => (
            <tr key={stage.id || i}>
              <td title={stage.name}>{stage.name || "-"}</td>
              <td title={stage.contractor}>
                {stage.contractor || "Unassigned"}
                {contractorView && !stage.contractor && (
                  <small style={{ color: '#666', display: 'block' }}>(Available for assignment)</small>
                )}
              </td>
              <td title={stage.duration}>{stage.duration || "0"}</td>
              <td title={stage.budget}>{stage.budget || "0"}</td>
              <td>
                {clientView ? (
                  <span className={`status-pill status-${stage.status.replace(/\s/g, "")}`}>
                    {stage.status}
                  </span>
                ) : (
                  <select
                    value={stage.status}
                    onChange={e => handleStatusChange(i, e.target.value)}
                    className={`dashboard-input status-${stage.status.replace(/\s/g, "")}`}
                    disabled={contractorView && stage.contractor !== user.name && stage.contractor}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                )}
              </td>
              {!clientView && (
                <td>
                  <div className="media-gallery">
                    {stage.media && stage.media.slice(0, 3).map(file => (
                      <img
                        key={file.id}
                        className="media-img"
                        src={file.url}
                        alt={file.name}
                        title={file.name}
                      />
                    ))}
                    {stage.media && stage.media.length > 3 && (
                      <span>+{stage.media.length - 3} more</span>
                    )}
                  </div>
                </td>
              )}
              {!clientView && !contractorView && (
                <td className="remove-cell">
                  <button
                    onClick={() => removeStage(stages.findIndex(s => s.id === stage.id))}
                    className="remove-btn"
                    title="Remove Stage"
                  >
                    ×
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
