import React, { useContext, useState } from "react";
import { WorkflowContext } from "../contexts/WorkflowContext";

const contractors = ["Rahul Narwane", "Rupali Jadhav", "Gaurav Jadhav", "Onkar Chavan"];
const statusOptions = ["pending", "in progress", "completed"];

const WorkflowBuilder = () => {
  const { addStage } = useContext(WorkflowContext);
  const initialFormState = {
    name: "",
    contractor: "",
    duration: "",
    budget: "",
    status: "pending",
  };
  const [form, setForm] = useState(initialFormState);
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Stage Name is required.");
      return;
    }
    addStage(form);
    setForm(initialFormState);
  };
  return (
    <div className="workflow-builder-container">
      <h2>Workflow Builder</h2>
      <form onSubmit={handleSubmit} className="workflow-form">
        <input
          type="text"
          name="name"
          placeholder="Stage Name"
          value={form.name}
          onChange={handleChange}
          className="workflow-input"
        />
        <select
          name="contractor"
          value={form.contractor}
          onChange={handleChange}
          className="workflow-input"
        >
          <option value="">Assign Contractor</option>
          {contractors.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          name="duration"
          min="0"
          placeholder="Duration (days)"
          value={form.duration}
          onChange={handleChange}
          className="workflow-input"
        />
        <input
          type="number"
          name="budget"
          min="0"
          placeholder="Budget (₹)"
          value={form.budget}
          onChange={handleChange}
          className="workflow-input"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="workflow-input"
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="workflow-submit-btn">Add Stage</button>
      </form>
    </div>
  );
};

export default WorkflowBuilder;
