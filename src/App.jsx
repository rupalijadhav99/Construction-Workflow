import React, { useContext } from "react";
import WorkflowBuilder from "./components/WorkflowBuilder";
import Login from "./components/Login";
import { AuthContext } from "./contexts/AuthContext";
import "./styles.css";
import Dashboard from "./components/DashBoard";

function App() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <Login />;

  const renderUserInterface = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            <Dashboard />
            <WorkflowBuilder />
          </>
        );
      case 'contractor':
        return (
          <>
            <Dashboard contractorView />
            <WorkflowBuilder contractorView />
          </>
        );
      case 'client':
        return <Dashboard clientView />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="app-container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <h1>🏗️ Construction Workflow</h1>
        <div>
          <span>Hi, {user.name} ({user.role}) </span>
          <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
        </div>
      </div>
      {renderUserInterface()}
    </div>
  );
}

export default App;
