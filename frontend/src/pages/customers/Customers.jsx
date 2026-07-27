import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";

import "./customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "Male",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers");
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
      full_name: "",
      email: "",
      phone: "",
      address: "",
      date_of_birth: "",
      gender: "Male",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateCustomer(editingId, form);
        toast.success("Customer Updated Successfully");
      } else {
        await createCustomer(form);
        toast.success("Customer Added Successfully");
      }

      resetForm();
      loadCustomers();
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Operation Failed"
      );
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);

    setForm({
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      date_of_birth: customer.date_of_birth,
      gender: customer.gender,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await deleteCustomer(id);

      toast.success("Customer Deleted Successfully");

      loadCustomers();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = search.toLowerCase();

    return (
      customer.full_name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.toLowerCase().includes(term)
    );
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer =
    indexOfLastCustomer - customersPerPage;

  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const totalPages = Math.ceil(
    filteredCustomers.length / customersPerPage
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

        <div className="customer-page">

          <h1 className="page-title">
            {editingId
              ? "Edit Customer"
              : "Customer Management"}
          </h1>

          <div className="customer-form">

            <h2>
              {editingId
                ? "Update Customer Details"
                : "Add New Customer"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  required
                />

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
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
                    ? "Update Customer"
                    : "Add Customer"}
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

          <div className="search-card">

            <input
              type="text"
              placeholder="🔍 Search by Name, Email or Phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

          </div>

          <div className="customer-table">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>
                              {currentCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                currentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>

                    <td>{customer.full_name}</td>

                    <td>{customer.email}</td>

                    <td>{customer.phone}</td>

                    <td>{customer.gender}</td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(customer)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(customer.id)
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

          <div className="pagination-box">

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

export default Customers;