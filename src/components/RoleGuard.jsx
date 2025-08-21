import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const RoleGuard = ({ role, children }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== role) return null;
  return <>{children}</>;
};
export default RoleGuard;
