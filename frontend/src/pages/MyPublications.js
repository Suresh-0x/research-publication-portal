import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function MyPublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const navLinks = [
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-publications", label: "Search" },
  ];

  const fetchMyPublications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/publications?mine=true");
      setPublications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPublications();
  }, []);

  const startEdit = (pub) => {
    setEditingId(pub._id);
    setActionError("");
    setEditFormData({
      paperTitle: pub.paperTitle,
      publicationType: pub.publicationType,
      journalConference: pub.journalConference,
      publicationYear: pub.publicationYear,
      DOI: pub.DOI || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
    setActionError("");
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    setSavingId(id);
    setActionError("");
    try {
      const response = await api.put(`/publications/${id}`, editFormData);
      setPublications((prev) =>
        prev.map((pub) => (pub._id === id ? response.data.publication : pub))
      );
      setEditingId(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not update publication.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <Navbar links={navLinks} />
      <div className="page">
        <div className="page-header">
          <h2>My Publications</h2>
        </div>

        {loading && <p className="empty-state">Loading your publications...</p>}
        {error && <p className="alert alert-error">{error}</p>}
        {actionError && <p className="alert alert-error">{actionError}</p>}

        {!loading && !error && publications.length === 0 && (
          <p className="empty-state">
            You haven't added any publications yet. <Link to="/add-publication">Add one now</Link>.
          </p>
        )}

        {publications.map((pub) => (
          <div key={pub._id} className={`entry entry-status-${pub.verificationStatus}`}>
            {editingId === pub._id ? (
              <div>
                <label className="field-label">Paper Title</label>
                <input
                  type="text"
                  name="paperTitle"
                  value={editFormData.paperTitle}
                  onChange={handleEditChange}
                  className="field-input"
                />

                <label className="field-label">Publication Type</label>
                <select
                  name="publicationType"
                  value={editFormData.publicationType}
                  onChange={handleEditChange}
                  className="field-input"
                >
                  <option value="Journal">Journal</option>
                  <option value="Conference">Conference</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Patent">Patent</option>
                </select>

                <label className="field-label">Journal / Conference</label>
                <input
                  type="text"
                  name="journalConference"
                  value={editFormData.journalConference}
                  onChange={handleEditChange}
                  className="field-input"
                />

                <label className="field-label">Publication Year</label>
                <input
                  type="number"
                  name="publicationYear"
                  value={editFormData.publicationYear}
                  onChange={handleEditChange}
                  className="field-input"
                />

                <label className="field-label">DOI</label>
                <input
                  type="text"
                  name="DOI"
                  value={editFormData.DOI}
                  onChange={handleEditChange}
                  className="field-input"
                />

                <div className="btn-row">
                  <button
                    onClick={() => saveEdit(pub._id)}
                    disabled={savingId === pub._id}
                    className="btn btn-small btn-verify"
                  >
                    {savingId === pub._id ? "Saving..." : "Save"}
                  </button>
                  <button onClick={cancelEdit} className="btn btn-small btn-ghost">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="entry-top">
                  <span className="entry-title">{pub.paperTitle}</span>
                  <span className="entry-status">{pub.verificationStatus}</span>
                </div>
                <p className="entry-meta">
                  {pub.publicationType} · {pub.journalConference} · {pub.publicationYear}
                </p>
                {pub.DOI && <p className="entry-meta">DOI: {pub.DOI}</p>}
                <div className="btn-row">
                  <button onClick={() => startEdit(pub)} className="btn btn-small btn-ghost">
                    Edit
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
