import { useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div>
        <h2 className="navbar-title">
          Insurance Management Platform
        </h2>
        <p className="navbar-subtitle">
          Welcome to your dashboard
        </p>
      </div>

      <div className="navbar-right">
        <div className="user-profile">
          <div className="avatar">👤</div>

          <div>
            <h4>Administrator</h4>
            <span>Secure Login</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;