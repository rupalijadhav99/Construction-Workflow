import React, { createContext, useState, useEffect } from "react";

export const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const [stages, setStages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const savedStages = localStorage.getItem('workflowStages');
    const savedProjects = localStorage.getItem('workflowProjects');
    const savedLogs = localStorage.getItem('activityLog');
    if (savedStages) setStages(JSON.parse(savedStages));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedLogs) setActivityLog(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('workflowStages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('workflowProjects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  const addLogEntry = (action, details) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user: "Current User",
    };
    setActivityLog(prev => [entry, ...prev]);
  };

  const addStage = (newStage) => {
    const stageWithMetadata = {
      id: Date.now(),
      ...newStage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      media: [],
    };
    setStages(prev => [...prev, stageWithMetadata]);
    addLogEntry("STAGE_ADDED", `Added stage: ${newStage.name}`);
  };

  const updateStage = (index, updates) => {
    setStages(prev => prev.map((stage, i) => (
      i === index ? {
        ...stage,
        ...updates,
        updatedAt: new Date().toISOString(),
      } : stage
    )));
    addLogEntry("STAGE_UPDATED", `Updated stage at index ${index}`);
  };

  const removeStage = (index) => {
    const stageName = stages[index]?.name || `Stage ${index + 1}`;
    setStages(prev => prev.filter((_, i) => i !== index));
    addLogEntry("STAGE_REMOVED", `Removed stage: ${stageName}`);
  };

  const reorderStages = (startIndex, endIndex) => {
    const newStages = Array.from(stages);
    const [removed] = newStages.splice(startIndex, 1);
    newStages.splice(endIndex, 0, removed);
    setStages(newStages);
    addLogEntry("STAGES_REORDERED", `Moved stage from ${startIndex} to ${endIndex}`);
  };

  const exportData = () => {
    const data = {
      stages,
      activityLog,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setStages([]);
      setActivityLog([]);
      localStorage.removeItem('workflowStages');
      localStorage.removeItem('activityLog');
      addLogEntry("DATA_CLEARED", "All data cleared");
    }
  };

  return (
    <WorkflowContext.Provider value={{
      stages,
      addStage,
      updateStage,
      removeStage,
      reorderStages,
      activityLog,
      exportData,
      clearAllData,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};
