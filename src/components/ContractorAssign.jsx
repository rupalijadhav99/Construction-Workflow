import React from "react";

const contractors = ["Rahul Narwane", "Rupali Jadhav", "Gaurav Jadhav", "Onkar Chavan"];

const ContractorAssign = ({ selected, onAssign, disabled }) => (
  <select
    value={selected || ""}
    onChange={e => onAssign(e.target.value)}
    disabled={disabled}
  >
    <option value="">Assign Contractor</option>
    {contractors.map(c => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
);

export default ContractorAssign;
