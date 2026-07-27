import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { getDashboardData } from "../../services/dashboardService";

import "./dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardData();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cards = stats
    ? [
        {
          title: "👥 Total Customers",
          value: stats.total_customers,
        },
        {
          title: "📄 Total Policies",
          value: stats.total_policies,
        },
        {
          title: "💰 Total Premium",
          value: `₹ ${stats.total_premiums}`,
        },
        {
          title: "📝 Total Claims",
          value: stats.total_claims,
        },
        {
          title: "✅ Active Policies",
          value: stats.active_policies,
        },
        {
          title: "✔ Approved Claims",
          value: stats.approved_claims,
        },
        {
          title: "⏳ Pending Claims",
          value: stats.pending_claims,
        },
        {
          title: "⚠ Expired Policies",
          value: stats.expired_policies,
        },
      ]
    : [];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f4f7fc",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <div className="dashboard-container">
          <h1 className="dashboard-title">
            Welcome to Insurance Management Platform
          </h1>

          {!stats ? (
            <h3>Loading Dashboard...</h3>
          ) : (
            <>
              <div className="stats-grid">
                {cards.map((card, index) => (
                  <div className="stat-card" key={index}>
                    <div className="stat-title">
                      {card.title}
                    </div>

                    <div className="stat-value">
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-footer">
                <h3>Dashboard Overview</h3>

                <p>
                  This dashboard provides a quick overview of the
                  Insurance Management Platform. You can manage
                  customers, insurance policies, premium payments,
                  claims, uploaded documents and generate PDF
                  reports from the navigation menu.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;