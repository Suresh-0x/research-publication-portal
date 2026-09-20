import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function SearchPublications() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const navLinks =
    user?.role === "admin"
      ? [
          { to: "/manage-publications", label: "Publications" },
          { to: "/manage-departments", label: "Departments" },
        ]
      : [
          { to: "/add-publication", label: "Add Publication" },
          { to: "/my-publications", label: "My Publications" },
        ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (year) params.append("year", year);
      if (status) params.append("status", status);

      const response = await api.get(`/publications?${params.toString()}`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not search publications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar links={navLinks} />
      <div className="page">
        <div className="page-header">
          <h2>Search Publications</h2>
        </div>

        <form onSubmit={handleSearch} className="filter-card">
          <label className="field-label">Paper Title</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field-input"
            placeholder="Search by title..."
          />

          <div className="filter-row">
            <div style={{ flex: 1 }}>
              <label className="field-label">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="field-input"
                placeholder="e.g. 2025"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="field-input">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="alert alert-error">{error}</p>}

        {hasSearched && !loading && !error && results.length === 0 && (
          <p className="empty-state">No publications matched your search.</p>
        )}

        {results.map((pub) => (
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
              By {pub.facultyId?.name} ({pub.facultyId?.email})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
