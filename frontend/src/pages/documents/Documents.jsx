import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

import {
  getDocuments,
  uploadDocument,
} from "../../services/documentService";

import "./documents.css";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 5;

  const [customerId, setCustomerId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load documents");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!customerId) {
      toast.error("Please enter Customer ID");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("customer_id", customerId);

      await uploadDocument(formData);

      toast.success("Document Uploaded Successfully");

      setCustomerId("");
      setSelectedFile(null);

      loadDocuments();
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload Failed"
      );
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const term = search.toLowerCase();

    return (
      doc.file_name.toLowerCase().includes(term) ||
      String(doc.customer_id).includes(term)
    );
  });

  const indexOfLast = currentPage * documentsPerPage;
  const indexOfFirst = indexOfLast - documentsPerPage;

  const currentDocuments = filteredDocuments.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredDocuments.length / documentsPerPage
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

        <div className="document-page">

          <h1 className="page-title">
            Document Management
          </h1>

          <div className="document-card">

            <h2>Upload Document</h2>

            <form onSubmit={handleUpload}>

              <div className="form-row">

                <input
                  type="number"
                  placeholder="Customer ID"
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(e.target.value)
                  }
                  required
                />

                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(e.target.files[0])
                  }
                  required
                />

              </div>

              <div
                className="action-buttons"
                style={{ marginTop: "20px" }}
              >

                <button
                  type="submit"
                  className="upload-btn"
                >
                  Upload Document
                </button>

              </div>

            </form>

          </div>

          <div className="document-card">

            <input
              type="text"
              placeholder="🔍 Search by file name or customer ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

          </div>

          <div className="document-table">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>File Name</th>
                  <th>Customer ID</th>
                  <th>Uploaded At</th>
                </tr>

              </thead>

              <tbody>
                              {currentDocuments.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No documents found
                  </td>
                </tr>
              ) : (
                currentDocuments.map((document) => (
                  <tr key={document.id}>
                    <td>{document.id}</td>

                    <td>{document.file_name}</td>

                    <td>{document.customer_id}</td>

                    <td>
                      {new Date(
                        document.uploaded_at
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}

              </tbody>

            </table>

          </div>

          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >

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

export default Documents;