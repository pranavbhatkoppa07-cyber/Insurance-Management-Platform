import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Customers from "../pages/customers/Customers";
import Policies from "../pages/policies/Policies";
import Premiums from "../pages/premiums/Premiums";
import Claims from "../pages/claims/Claims";
import Documents from "../pages/documents/Documents";
import Reports from "../pages/reports/Reports";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/customers" element={<Customers />} />

      <Route path="/policies" element={<Policies />} />

      <Route path="/premiums" element={<Premiums />} />

      <Route path="/claims" element={<Claims />} />

      <Route path="/documents" element={<Documents />} />

      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}