import React, { useContext } from "react";
import { WorkflowContext } from "../contexts/WorkflowContext";
import ContractorAssign from "./ContractorAssign";
import MediaGallery from "./MediaGallery";
import StatusTracker from "./StatusTracker";

const WorkflowStage = ({ stage, index, contractorView }) => {
  const { updateStage, removeStage } = useContext(WorkflowContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateStage(index, { ...stage, [name]: value });
  };

  const handleMediaUpload = (files) => {
    updateStage(index, { 
      ...stage, 
      media: [...(stage.media || []), ...files] 
    });
  };

  const handleMediaRemove = (fileId) => {
    updateStage(index, { 
      ...stage, 
      media: (stage.media || []).filter(file => file.id !== fileId)
    });
  };

  return (
    <div className="stage-card">
      <div className="stage-fields">
        <input
          name="name"
          value={stage.name}
          onChange={handleChange}
          placeholder="Stage Name"
          disabled={contractorView}
        />
        <ContractorAssign
          selected={stage.contractor}
          onAssign={val => updateStage(index, { ...stage, contractor: val })}
          disabled={contractorView}
        />
        <input
          name="duration"
          type="number"
          min="0"
          value={stage.duration}
          onChange={handleChange}
          placeholder="Duration (days)"
          disabled={contractorView}
        />
        <input
          name="budget"
          type="number"
          min="0"
          value={stage.budget}
          onChange={handleChange}
          placeholder="Budget (Rs)"
          disabled={contractorView}
        />
        {!contractorView && (
          <button className="remove-btn" onClick={() => removeStage(index)}>
            Remove
          </button>
        )}
      </div>
      
      <StatusTracker
        status={stage.status}
        onUpdate={status => updateStage(index, { 
          ...stage, 
          status,
          ...(status === 'completed' && { completedAt: new Date().toISOString() })
        })}
        timestamp={stage.completedAt}
        disabled={!contractorView}
        showDropdown={stage.status !== "pending"}
      />
      
      <MediaGallery
        media={stage.media || []}
        onUpload={handleMediaUpload}
        onRemove={handleMediaRemove}
        disabled={!contractorView}
      />
    </div>
  );
};

export default WorkflowStage;
