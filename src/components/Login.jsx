import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const contractors = ["Rahul Narwane", "Rupali Jadhav", "Gaurav Jadhav", "Onkar Chavan"];

const Login = () => {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState("admin");
  const [name, setName] = useState("");
  const [selectedContractor, setSelectedContractor] = useState("");

  const handleLogin = () => {
    if (role === "contractor") {
      if (!selectedContractor) {
        alert("Please select your contractor name.");
        return;
      }
      login({ name: selectedContractor, role });
    } else {
      if (!name.trim()) {
        alert("Please enter your name.");
        return;
      }
      login({ name: name.trim(), role });
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: 350, marginTop: 100 }}>
      <h2>Welcome!</h2>
      
      <select
        style={{ width: "100%" }}
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="contractor">Contractor</option>
        <option value="client">Client</option>
      </select>

      {role !== "contractor" && (
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "92.5%" }}
        />
      )}

      {role === "contractor" && (
        <select
          style={{ width: "100%" }}
          value={selectedContractor}
          onChange={e => setSelectedContractor(e.target.value)}
        >
          <option value="">Select Your Name</option>
          {contractors.map(contractor => (
            <option key={contractor} value={contractor}>{contractor}</option>
          ))}
        </select>
      )}

      <button
        style={{ width: "100%" }}
        onClick={handleLogin}
        disabled={role === "contractor" ? !selectedContractor : !name.trim()}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
