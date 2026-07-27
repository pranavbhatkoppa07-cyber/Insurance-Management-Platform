import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  getPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "../../services/policyService";

import "./policies.css";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const policiesPerPage = 5;

  const [form, setForm] = useState({
    policy_number: "",
    policy_name: "",
    policy_type: "",
    premium_amount: "",
    coverage_amount: "",
    start_date: "",
    end_date: "",
    status: "Active",
    customer_id: "",
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await getPolicies();
      setPolicies(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load policies");
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
      policy_number: "",
      policy_name: "",
      policy_type: "",
      premium_amount: "",
      coverage_amount: "",
      start_date: "",
      end_date: "",
      status: "Active",
      customer_id: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updatePolicy(editingId, form);
        toast.success("Policy Updated Successfully");
      } else {
        await createPolicy(form);
        toast.success("Policy Added Successfully");
      }

      resetForm();
      loadPolicies();
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Operation Failed"
      );
    }
  };

  const handleEdit = (policy) => {
    setEditingId(policy.id);

    setForm({
      policy_number: policy.policy_number,
      policy_name: policy.policy_name,
      policy_type: policy.policy_type,
      premium_amount: policy.premium_amount,
      coverage_amount: policy.coverage_amount,
      start_date: policy.start_date,
      end_date: policy.end_date,
      status: policy.status,
      customer_id: policy.customer_id,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy?")) return;

    try {
      await deletePolicy(id);
      toast.success("Policy Deleted Successfully");
      loadPolicies();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const term = search.toLowerCase();

    return (
      policy.policy_number.toLowerCase().includes(term) ||
      policy.policy_name.toLowerCase().includes(term) ||
      policy.policy_type.toLowerCase().includes(term) ||
      policy.status.toLowerCase().includes(term)
    );
  });

  const indexOfLastPolicy = currentPage * policiesPerPage;
  const indexOfFirstPolicy =
    indexOfLastPolicy - policiesPerPage;

  const currentPolicies = filteredPolicies.slice(
    indexOfFirstPolicy,
    indexOfLastPolicy
  );

  const totalPages = Math.ceil(
    filteredPolicies.length / policiesPerPage
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

        <div className="policy-page">

          <h1 className="page-title">
            {editingId
              ? "Edit Policy"
              : "Policy Management"}
          </h1>

          <div className="policy-form">

            <h2>
              {editingId
                ? "Update Policy"
                : "Add New Policy"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <input
                  type="text"
                  name="policy_number"
                  placeholder="Policy Number"
                  value={form.policy_number}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="policy_name"
                  placeholder="Policy Name"
                  value={form.policy_name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="policy_type"
                  placeholder="Policy Type"
                  value={form.policy_type}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="premium_amount"
                  placeholder="Premium Amount"
                  value={form.premium_amount}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="coverage_amount"
                  placeholder="Coverage Amount"
                  value={form.coverage_amount}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="customer_id"
                  placeholder="Customer ID"
                  value={form.customer_id}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Expired">
                    Expired
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

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
                    ? "Update Policy"
                    : "Add Policy"}
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

          <div className="policy-search">

            <input
              type="text"
              placeholder="🔍 Search by policy number, name, type or status..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

          </div>

          <div className="policy-table">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Policy No</th>
                  <th>Policy Name</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Coverage</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>
                              {currentPolicies.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No policies found
                  </td>
                </tr>
              ) : (
                currentPolicies.map((policy) => (
                  <tr key={policy.id}>
                    <td>{policy.id}</td>

                    <td>{policy.policy_number}</td>

                    <td>{policy.policy_name}</td>

                    <td>{policy.policy_type}</td>

                    <td>₹ {policy.premium_amount}</td>

                    <td>₹ {policy.coverage_amount}</td>

                    <td>{policy.status}</td>

                    <td>{policy.customer_id}</td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(policy)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(policy.id)
                          }
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

          <div className="policy-pagination">

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

export default Policies;