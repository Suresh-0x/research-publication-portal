import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function ManagePublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const navLinks = [
    { to: "/manage-departments", label: "Departments" },
    { to: "/search-publications", label: "Search" },
  ];

  const fetchAllPublications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/publications");
      setPublications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPublications();
  }, []);

  const updateStatus = async (id, newStatus) => {
    setBusyId(id);
    setActionError("");
    try {
      const response = await api.put(`/publications/${id}`, { verificationStatus: newStatus });
      setPublications((prev) =>
        prev.map((pub) => (pub._id === id ? response.data.publication : pub))
      );
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not update status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this publication permanently? This cannot be undone.");
    if (!confirmed) return;

    setBusyId(id);
    setActionError("");
    try {
      await api.delete(`/publications/${id}`);
      setPublications((prev) => prev.filter((pub) => pub._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not delete publication.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <Navbar links={navLinks} />
      <div className="page">
        <div className="page-header">
          <h2>Manage Publications</h2>
        </div>

        {loading && <p className="empty-state">Loading publications...</p>}
        {error && <p className="alert alert-error">{error}</p>}
        {actionError && <p className="alert alert-error">{actionError}</p>}
        {!loading && !error && publications.length === 0 && (
          <p className="empty-state">No publications found.</p>
        )}

        {publications.map((pub) => (
          <div key={pub._id} className={`entry entry-status-${pub.verificationStatus}`}>
            <div className="entry-top">
              <span className="entry-title">{pub.paperTitle}</span>
              <span className="entry-status">{pub.verificationStatus}</span>
            </div>
            <p className="entry-meta">
              {pub.publicationType} · {pub.journalConference} · {pub.publicationYear}
            </p>
            {pub.DOI && <p className="entry-meta">DOI: {pub.DOI}</p>}
            <p className="entry-meta">
              Submitted by {pub.facultyId?.name} ({pub.facultyId?.email})
            </p>

            <div className="btn-row">
              <button
                onClick={() => updateStatus(pub._id, "verified")}
                disabled={busyId === pub._id || pub.verificationStatus === "verified"}
                className="btn btn-small btn-verify"
              >
                Verify
              </button>
              <button
                onClick={() => updateStatus(pub._id, "rejected")}
                disabled={busyId === pub._id || pub.verificationStatus === "rejected"}
                className="btn btn-small btn-reject"
              >
                Reject
              </button>
              <button
                onClick={() => handleDelete(pub._id)}
                disabled={busyId === pub._id}
                className="btn btn-small btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
