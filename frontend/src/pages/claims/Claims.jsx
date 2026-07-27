import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  getClaims,
  createClaim,
  updateClaim,
  deleteClaim,
} from "../../services/claimService";

import "./claims.css";

function Claims() {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const claimsPerPage = 5;

  const [form, setForm] = useState({
    claim_number: "",
    claim_amount: "",
    claim_reason: "",
    claim_date: "",
    status: "Pending",
    policy_id: "",
  });

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const data = await getClaims();
      setClaims(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load claims");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      claim_number: "",
      claim_amount: "",
      claim_reason: "",
      claim_date: "",
      status: "Pending",
      policy_id: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateClaim(editingId, form);
        toast.success("Claim Updated Successfully");
      } else {
        await createClaim(form);
        toast.success("Claim Added Successfully");
      }

      resetForm();
      loadClaims();
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Operation Failed"
      );
    }
  };

  const handleEdit = (claim) => {
    setEditingId(claim.id);

    setForm({
      claim_number: claim.claim_number,
      claim_amount: claim.claim_amount,
      claim_reason: claim.claim_reason,
      claim_date: claim.claim_date,
      status: claim.status,
      policy_id: claim.policy_id,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this claim?")) return;

    try {
      await deleteClaim(id);
      toast.success("Claim Deleted Successfully");
      loadClaims();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const term = search.toLowerCase();

    return (
      claim.claim_number.toLowerCase().includes(term) ||
      claim.claim_reason.toLowerCase().includes(term) ||
      claim.status.toLowerCase().includes(term) ||
      String(claim.policy_id).includes(term)
    );
  });

  const indexOfLastClaim = currentPage * claimsPerPage;
  const indexOfFirstClaim =
    indexOfLastClaim - claimsPerPage;

  const currentClaims = filteredClaims.slice(
    indexOfFirstClaim,
    indexOfLastClaim
  );

  const totalPages = Math.ceil(
    filteredClaims.length / claimsPerPage
  );

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

        <div className="claim-page">

          <h1 className="page-title">
            {editingId
              ? "Edit Claim"
              : "Claim Management"}
          </h1>

          <div className="claim-form">

            <h2>
              {editingId
                ? "Update Claim"
                : "Add New Claim"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <input
                  type="text"
                  name="claim_number"
                  placeholder="Claim Number"
                  value={form.claim_number}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="claim_amount"
                  placeholder="Claim Amount"
                  value={form.claim_amount}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="policy_id"
                  placeholder="Policy ID"
                  value={form.policy_id}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="claim_date"
                  value={form.claim_date}
                  onChange={handleChange}
                  required
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>

                <textarea
                  name="claim_reason"
                  placeholder="Claim Reason"
                  rows="4"
                  value={form.claim_reason}
                  onChange={handleChange}
                  required
                  style={{
                    gridColumn: "1 / -1",
                    resize: "vertical",
                  }}
                />

              </div>

              <div
                className="action-buttons"
                style={{ marginTop: "15px" }}
              >

                <button
                  type="submit"
                  className="success-btn"
                >
                  {editingId
                    ? "Update Claim"
                    : "Add Claim"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>

          <div className="claim-search">

            <input
              type="text"
              placeholder="🔍 Search by claim number, reason, status or policy ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

          </div>

          <div className="claim-table">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Claim No</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Policy ID</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>
                              {currentClaims.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No claims found
                  </td>
                </tr>
              ) : (
                currentClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td>{claim.id}</td>

                    <td>{claim.claim_number}</td>

                    <td>₹ {claim.claim_amount}</td>

                    <td>{claim.claim_reason}</td>

                    <td>{claim.claim_date}</td>

                    <td>{claim.status}</td>

                    <td>{claim.policy_id}</td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(claim)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(claim.id)}
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}

              </tbody>

            </table>

          </div>

          <div className="claim-pagination">

            <button
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
              disabled={currentPage === 1}
            >
              ◀ Previous
            </button>

            <span
              style={{
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
            >
              Next ▶
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Claims;