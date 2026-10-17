import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./ManageDepartments.css";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    departmentName: "",
    HODName: "",
    totalFaculty: "",
  });

  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    departmentName: "",
    HODName: "",
    totalFaculty: 0,
  });

  const [savingId, setSavingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const navLinks = [
    {
      to: "/admin-dashboard",
      label: "Dashboard",
    },
    {
      to: "/manage-publications",
      label: "Publications",
    },
    {
      to: "/search-publications",
      label: "Search",
    },
  ];

  // =========================================================
  // FETCH DEPARTMENTS
  // =========================================================

  const fetchDepartments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/departments");

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.departments)
        ? data.departments
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setDepartments(list);
    } catch (err) {
      console.error("Fetch departments error:", err);

      setError(
        err.response?.data?.message ||
          "Could not load departments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================================================
  // ADD DEPARTMENT
  // =========================================================

  const handleAddChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    setAdding(true);
    setActionError("");
    setSuccessMessage("");

    try {
      const totalFaculty =
        formData.totalFaculty === ""
          ? 0
          : Number(formData.totalFaculty);

      if (
        Number.isNaN(totalFaculty) ||
        totalFaculty < 0
      ) {
        setActionError(
          "Total Faculty must be a valid non-negative number."
        );
        return;
      }

      const payload = {
        departmentName:
          formData.departmentName.trim(),

        HODName:
          formData.HODName.trim(),

        totalFaculty,
      };

      const response = await api.post(
        "/departments",
        payload
      );

      const newDepartment =
        response.data?.department;

      if (!newDepartment) {
        throw new Error(
          "Department was not returned by server."
        );
      }

      setDepartments((prev) => [
        ...prev,
        newDepartment,
      ]);

      setFormData({
        departmentName: "",
        HODName: "",
        totalFaculty: "",
      });

      setSuccessMessage(
        "Department added successfully."
      );
    } catch (err) {
      console.error(
        "Add department error:",
        err
      );

      setActionError(
        err.response?.data?.message ||
          "Could not create department."
      );
    } finally {
      setAdding(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const startEdit = (dept) => {
    setEditingId(dept._id);
    setActionError("");
    setSuccessMessage("");

    setEditFormData({
      departmentName:
        dept.departmentName || "",

      HODName:
        dept.HODName || "",

      totalFaculty:
        Number(dept.totalFaculty) || 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);

    setEditFormData({
      departmentName: "",
      HODName: "",
      totalFaculty: 0,
    });

    setActionError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE EDIT
  // =========================================================

  const saveEdit = async (id) => {
    setSavingId(id);
    setActionError("");
    setSuccessMessage("");

    try {
      const totalFaculty =
        editFormData.totalFaculty === ""
          ? 0
          : Number(editFormData.totalFaculty);

      if (
        Number.isNaN(totalFaculty) ||
        totalFaculty < 0
      ) {
        setActionError(
          "Total Faculty must be a valid non-negative number."
        );

        setSavingId(null);
        return;
      }

      const payload = {
        departmentName:
          editFormData.departmentName.trim(),

        HODName:
          editFormData.HODName.trim(),

        totalFaculty,
      };

      const response = await api.put(
        `/departments/${id}`,
        payload
      );

      const updatedDepartment =
        response.data?.department;

      if (!updatedDepartment) {
        throw new Error(
          "Updated department was not returned by server."
        );
      }

      setDepartments((prev) =>
        prev.map((department) =>
          department._id === id
            ? updatedDepartment
            : department
        )
      );

      setEditingId(null);

      setEditFormData({
        departmentName: "",
        HODName: "",
        totalFaculty: 0,
      });

      setSuccessMessage(
        "Department updated successfully."
      );
    } catch (err) {
      console.error(
        "Update department error:",
        err
      );

      setActionError(
        err.response?.data?.message ||
          "Could not update department."
      );
    } finally {
      setSavingId(null);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this department? This cannot be undone."
    );

    if (!confirmed) return;

    setBusyId(id);
    setActionError("");
    setSuccessMessage("");

    try {
      await api.delete(
        `/departments/${id}`
      );

      setDepartments((prev) =>
        prev.filter(
          (department) =>
            department._id !== id
        )
      );

      setSuccessMessage(
        "Department deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete department error:",
        err
      );

      setActionError(
        err.response?.data?.message ||
          "Could not delete department."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="departments-page">
      <Navbar links={navLinks} />

      <main className="departments-container">

        {/* HEADER */}
        <div className="departments-header">
          <div>
            <div className="header-icon">
              🏢
            </div>

            <h1>
              Manage Departments
            </h1>

            <p>
              Manage departments, HODs and
              faculty information.
            </p>
          </div>

          <div className="department-count">
            <span>{departments.length}</span>
            <small>Departments</small>
          </div>
        </div>

        {/* MESSAGES */}
        {actionError && (
          <div className="message error-message">
            ⚠ {actionError}
          </div>
        )}

        {successMessage && (
          <div className="message success-message">
            ✓ {successMessage}
          </div>
        )}

        {/* ADD DEPARTMENT */}
        <section className="add-department-card">

          <div className="section-heading">
            <div className="section-icon">
              +
            </div>

            <div>
              <h2>
                Add New Department
              </h2>

              <p>
                Enter department details below.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddSubmit}
          >
            <div className="form-grid">

              <div className="form-group">
                <label>
                  Department Name
                </label>

                <input
                  type="text"
                  name="departmentName"
                  value={
                    formData.departmentName
                  }
                  onChange={
                    handleAddChange
                  }
                  required
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>

              <div className="form-group">
                <label>
                  HOD Name
                </label>

                <input
                  type="text"
                  name="HODName"
                  value={
                    formData.HODName
                  }
                  onChange={
                    handleAddChange
                  }
                  required
                  placeholder="Enter HOD name"
                />
              </div>

              <div className="form-group">
                <label>
                  Total Faculty
                </label>

                <input
                  type="number"
                  name="totalFaculty"
                  value={
                    formData.totalFaculty
                  }
                  onChange={
                    handleAddChange
                  }
                  min="0"
                  placeholder="0"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={adding}
              className="add-button"
            >
              {adding
                ? "Adding..."
                : "Add Department"}
            </button>
          </form>
        </section>

        {/* DEPARTMENT LIST */}
        <div className="list-heading">
          <div>
            <h2>
              Departments
            </h2>

            <p>
              View and manage all departments.
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="empty-card">
            <div className="loading-spinner">
              ⟳
            </div>

            <p>
              Loading departments...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="empty-card">
            <div className="empty-icon">
              ⚠
            </div>

            <p>{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          departments.length === 0 && (
            <div className="empty-card">
              <div className="empty-icon">
                🏢
              </div>

              <h3>
                No departments yet
              </h3>

              <p>
                Add your first department
                using the form above.
              </p>
            </div>
          )}

        {/* CARDS */}
        {!loading &&
          !error &&
          departments.length > 0 && (
            <div className="department-grid">

              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="department-card"
                >

                  {editingId ===
                  dept._id ? (

                    /* ================= EDIT MODE ================= */

                    <div className="edit-content">

                      <div className="edit-title">
                        <span>
                          ✏️
                        </span>

                        <h3>
                          Edit Department
                        </h3>
                      </div>

                      <div className="form-group">
                        <label>
                          Department Name
                        </label>

                        <input
                          type="text"
                          name="departmentName"
                          value={
                            editFormData.departmentName
                          }
                          onChange={
                            handleEditChange
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          HOD Name
                        </label>

                        <input
                          type="text"
                          name="HODName"
                          value={
                            editFormData.HODName
                          }
                          onChange={
                            handleEditChange
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Total Faculty
                        </label>

                        <input
                          type="number"
                          name="totalFaculty"
                          value={
                            editFormData.totalFaculty
                          }
                          onChange={
                            handleEditChange
                          }
                          min="0"
                        />
                      </div>

                      <div className="edit-actions">

                        <button
                          type="button"
                          onClick={() =>
                            saveEdit(
                              dept._id
                            )
                          }
                          disabled={
                            savingId ===
                            dept._id
                          }
                          className="save-button"
                        >
                          {savingId ===
                          dept._id
                            ? "Saving..."
                            : "✓ Save Changes"}
                        </button>

                        <button
                          type="button"
                          onClick={
                            cancelEdit
                          }
                          className="cancel-button"
                        >
                          Cancel
                        </button>

                      </div>
                    </div>

                  ) : (

                    /* ================= VIEW MODE ================= */

                    <>

                      <div className="department-card-header">

                        <div className="department-icon">
                          🏢
                        </div>

                        <div className="department-title">
                          <h3>
                            {
                              dept.departmentName
                            }
                          </h3>

                          <span>
                            Department
                          </span>
                        </div>

                      </div>

                      <div className="department-info">

                        <div className="info-box">
                          <span className="info-icon">
                            👨‍🏫
                          </span>

                          <div>
                            <small>
                              HOD
                            </small>

                            <strong>
                              {
                                dept.HODName
                              }
                            </strong>
                          </div>
                        </div>

                        <div className="info-box">
                          <span className="info-icon">
                            👥
                          </span>

                          <div>
                            <small>
                              Total Faculty
                            </small>

                            <strong>
                              {
                                Number(
                                  dept.totalFaculty
                                ) || 0
                              }
                            </strong>
                          </div>
                        </div>

                      </div>

                      <div className="card-actions">

                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              dept
                            )
                          }
                          className="edit-button"
                        >
                          ✏ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              dept._id
                            )
                          }
                          disabled={
                            busyId ===
                            dept._id
                          }
                          className="delete-button"
                        >
                          {busyId ===
                          dept._id
                            ? "Deleting..."
                            : "🗑 Delete"}
                        </button>

                      </div>

                    </>
                  )}

                </div>
              ))}

            </div>
          )}

      </main>
    </div>
  );
}