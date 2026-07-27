import { toast } from "react-toastify";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import { downloadReport } from "../../services/reportService";

import "./reports.css";

function Reports() {
  const handleDownload = async () => {
    try {
      const pdfBlob = await downloadReport();

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "Insurance_Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Report Downloaded Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Download Report");
    }
  };

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

        <div className="report-page">
          <div className="report-card">
            <div className="report-icon">📊</div>

            <h2>Insurance Management Report</h2>

            <p>
              Generate a professional PDF report containing
              the latest statistics from your Insurance
              Management Platform.
            </p>

            <div
              style={{
                textAlign: "left",
                maxWidth: "450px",
                margin: "25px auto",
                lineHeight: "2",
              }}
            >
              <p>✅ Total Customers</p>
              <p>✅ Total Policies</p>
              <p>✅ Total Premium Records</p>
              <p>✅ Total Claims</p>
            </div>

            <button
              className="report-btn"
              onClick={handleDownload}
            >
              📄 Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;