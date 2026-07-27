import { NavLink } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">
        🛡️ Insurance
      </h2>

      <p className="logo-subtitle">
        Management Platform
      </p>

      <hr className="divider" />

      <nav className="menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          👥 Customers
        </NavLink>

        <NavLink
          to="/policies"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          📄 Policies
        </NavLink>

        <NavLink
          to="/premiums"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          💳 Premiums
        </NavLink>

        <NavLink
          to="/claims"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          📋 Claims
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          📁 Documents
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          📊 Reports
        </NavLink>

      </nav>
    </div>
  );
}

export default Sidebar;