import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function AddPublication() {
  const [formData, setFormData] = useState({
    paperTitle: "",
    publicationType: "Journal",
    journalConference: "",
    publicationYear: new Date().getFullYear(),
    DOI: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navLinks = [
    { to: "/my-publications", label: "My Publications" },
    { to: "/search-publications", label: "Search" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/publications", formData);
      setSuccess("Publication added. It is now pending admin verification.");
      setFormData({
        paperTitle: "",
        publicationType: "Journal",
        journalConference: "",
        publicationYear: new Date().getFullYear(),
        DOI: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not add publication. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar links={navLinks} />
      <div className="page" style={{ maxWidth: "540px" }}>
        <div className="page-header">
          <h2>Add Publication</h2>
        </div>

        {error && <p className="alert alert-error">{error}</p>}
        {success && <p className="alert alert-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label className="field-label">Paper Title</label>
          <input
            type="text"
            name="paperTitle"
            value={formData.paperTitle}
            onChange={handleChange}
            required
            className="field-input"
            placeholder="e.g. AI in Education Systems"
          />

          <label className="field-label">Publication Type</label>
          <select
            name="publicationType"
            value={formData.publicationType}
            onChange={handleChange}
            className="field-input"
          >
            <option value="Journal">Journal</option>
            <option value="Conference">Conference</option>
            <option value="Book Chapter">Book Chapter</option>
            <option value="Patent">Patent</option>
          </select>

          <label className="field-label">Journal / Conference Name</label>
          <input
            type="text"
            name="journalConference"
            value={formData.journalConference}
            onChange={handleChange}
            required
            className="field-input"
            placeholder="e.g. International Journal of AI Research"
          />

          <label className="field-label">Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            required
            min="1990"
            max="2100"
            className="field-input"
          />

          <label className="field-label">DOI (optional)</label>
          <input
            type="text"
            name="DOI"
            value={formData.DOI}
            onChange={handleChange}
            className="field-input"
            placeholder="e.g. 10.1234/ijair.2025.001"
          />

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Submitting..." : "Add Publication"}
          </button>
        </form>
      </div>
    </div>
  );
}
