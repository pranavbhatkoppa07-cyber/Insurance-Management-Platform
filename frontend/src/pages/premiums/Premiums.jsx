import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  getPremiums,
  createPremium,
  updatePremium,
  deletePremium,
} from "../../services/premiumService";

import "./premiums.css";

function Premiums() {
  const [premiums, setPremiums] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const premiumsPerPage = 5;

  const [form, setForm] = useState({
    amount: "",
    payment_date: "",
    payment_method: "",
    status: "Paid",
    policy_id: "",
  });

  useEffect(() => {
    loadPremiums();
  }, []);

  const loadPremiums = async () => {
    try {
      const data = await getPremiums();
      setPremiums(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load premiums");
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
      amount: "",
      payment_date: "",
      payment_method: "",
      status: "Paid",
      policy_id: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updatePremium(editingId, form);
        toast.success("Premium Updated Successfully");
      } else {
        await createPremium(form);
        toast.success("Premium Added Successfully");
      }

      resetForm();
      loadPremiums();
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Operation Failed"
      );
    }
  };

  const handleEdit = (premium) => {
    setEditingId(premium.id);

    setForm({
      amount: premium.amount,
      payment_date: premium.payment_date,
      payment_method: premium.payment_method,
      status: premium.status,
      policy_id: premium.policy_id,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this premium?")) return;

    try {
      await deletePremium(id);
      toast.success("Premium Deleted Successfully");
      loadPremiums();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const filteredPremiums = premiums.filter((premium) => {
    const term = search.toLowerCase();

    return (
      premium.payment_method.toLowerCase().includes(term) ||
      premium.status.toLowerCase().includes(term) ||
      String(premium.policy_id).includes(term)
    );
  });

  const indexOfLastPremium = currentPage * premiumsPerPage;
  const indexOfFirstPremium =
    indexOfLastPremium - premiumsPerPage;

  const currentPremiums = filteredPremiums.slice(
    indexOfFirstPremium,
    indexOfLastPremium
  );

  const totalPages = Math.ceil(
    filteredPremiums.length / premiumsPerPage
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

        <div className="premium-page">

          <h1 className="page-title">
            {editingId
              ? "Edit Premium"
              : "Premium Management"}
          </h1>

          <div className="premium-form">

            <h2>
              {editingId
                ? "Update Premium"
                : "Add New Premium"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <input
                  type="number"
                  name="amount"
                  placeholder="Premium Amount"
                  value={form.amount}
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
                  name="payment_date"
                  value={form.payment_date}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="payment_method"
                  placeholder="Payment Method"
                  value={form.payment_method}
                  onChange={handleChange}
                  required
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Failed">
                    Failed
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
                    ? "Update Premium"
                    : "Add Premium"}
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

          <div className="premium-search">

            <input
              type="text"
              placeholder="🔍 Search by payment method, status or policy ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

          </div>

          <div className="premium-table">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Policy ID</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>
                              {currentPremiums.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No premiums found
                  </td>
                </tr>
              ) : (
                currentPremiums.map((premium) => (
                  <tr key={premium.id}>
                    <td>{premium.id}</td>

                    <td>₹ {premium.amount}</td>

                    <td>{premium.payment_date}</td>

                    <td>{premium.payment_method}</td>

                    <td>{premium.status}</td>

                    <td>{premium.policy_id}</td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(premium)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(premium.id)}
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

          <div className="premium-pagination">

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

export default Premiums;