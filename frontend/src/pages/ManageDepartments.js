import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [formData, setFormData] = useState({ departmentName: "", HODName: "", totalFaculty: "" });
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const navLinks = [
    { to: "/manage-publications", label: "Publications" },
    { to: "/search-publications", label: "Search" },
  ];

  const fetchDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    setActionError("");
    try {
      const response = await api.post("/departments", formData);
      setDepartments((prev) => [...prev, response.data.department]);
      setFormData({ departmentName: "", HODName: "", totalFaculty: "" });
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not create department.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (dept) => {
    setEditingId(dept._id);
    setActionError("");
    setEditFormData({
      departmentName: dept.departmentName,
      HODName: dept.HODName,
      totalFaculty: dept.totalFaculty,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    setSavingId(id);
    setActionError("");
    try {
      const response = await api.put(`/departments/${id}`, editFormData);
      setDepartments((prev) => prev.map((d) => (d._id === id ? response.data.department : d)));
      setEditingId(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not update department.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this department? This cannot be undone.");
    if (!confirmed) return;

    setBusyId(id);
    setActionError("");
    try {
      await api.delete(`/departments/${id}`);
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not delete department.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <Navbar links={navLinks} />
      <div className="page">
        <div className="page-header">
          <h2>Manage Departments</h2>
        </div>

        <form onSubmit={handleAddSubmit} className="filter-card">
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Add New Department</h3>
          {actionError && <p className="alert alert-error">{actionError}</p>}
          <div className="filter-row">
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleAddChange}
              required
              className="field-input"
              placeholder="Department Name"
            />
            <input
              type="text"
              name="HODName"
              value={formData.HODName}
              onChange={handleAddChange}
              required
              className="field-input"
              placeholder="HOD Name"
            />
            <input
              type="number"
              name="totalFaculty"
              value={formData.totalFaculty}
              onChange={handleAddChange}
              className="field-input"
              placeholder="Total Faculty"
            />
          </div>
          <button type="submit" disabled={adding} className="btn btn-primary" style={{ width: "auto" }}>
            {adding ? "Adding..." : "Add Department"}
          </button>
        </form>

        {loading && <p className="empty-state">Loading departments...</p>}
        {error && <p className="alert alert-error">{error}</p>}
        {!loading && !error && departments.length === 0 && (
          <p className="empty-state">No departments added yet.</p>
        )}

        {departments.map((dept) => (
          <div key={dept._id} className="entry">
            {editingId === dept._id ? (
              <div>
                <label className="field-label">Department Name</label>
                <input
                  type="text"
                  name="departmentName"
                  value={editFormData.departmentName}
                  onChange={handleEditChange}
                  className="field-input"
                />
                <label className="field-label">HOD Name</label>
                <input
                  type="text"
                  name="HODName"
                  value={editFormData.HODName}
                  onChange={handleEditChange}
                  className="field-input"
                />
                <label className="field-label">Total Faculty</label>
                <input
                  type="number"
                  name="totalFaculty"
                  value={editFormData.totalFaculty}
                  onChange={handleEditChange}
                  className="field-input"
                />
                <div className="btn-row">
                  <button
                    onClick={() => saveEdit(dept._id)}
                    disabled={savingId === dept._id}
                    className="btn btn-small btn-verify"
                  >
                    {savingId === dept._id ? "Saving..." : "Save"}
                  </button>
                  <button onClick={cancelEdit} className="btn btn-small btn-ghost">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <span className="entry-title">{dept.departmentName}</span>
                <p className="entry-meta">HOD: {dept.HODName}</p>
                <p className="entry-meta">Total Faculty: {dept.totalFaculty}</p>
                <div className="btn-row">
                  <button onClick={() => startEdit(dept)} className="btn btn-small btn-ghost">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    disabled={busyId === dept._id}
                    className="btn btn-small btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
