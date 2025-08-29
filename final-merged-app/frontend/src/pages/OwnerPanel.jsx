import React, { useEffect, useState } from "react";
import api from "../api";

export default function OwnerPanel() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [uploads, setUploads] = useState([]);
  const [summary, setSummary] = useState(null);
  const load = async () => {
    const u = await api.get("/uploads/owner");
    setUploads(u.data);
    const s = await api.get("/owner/reviews/summary");
    setSummary(s.data);
  };
  useEffect(() => { load(); }, []);

  const createUpload = async (e) => {
    e.preventDefault();
    await api.post("/uploads", form);
    setForm({ title: "", description: "" });
    load();
  };

  const clearReviews = async () => {
    if (!window.confirm("Clear all reviews for your uploads?")) return;
    await api.delete("/owner/reviews/clear");
    load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Owner Panel</h2>
      <form onSubmit={createUpload} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button>Create Upload</button>
      </form>

      <h3 style={{ marginTop: 24 }}>My Uploads</h3>
      <ul>
        {uploads.map(u => <li key={u._id}>{u.title} – {u.description}</li>)}
      </ul>

      <h3 style={{ marginTop: 24 }}>Reviews Summary</h3>
      {summary && (
        <div>
          <p>Global Average: <strong>{summary.globalAverage}</strong></p>
          {summary.winner ? (
            <p>Winner: <strong>{summary.winner.title}</strong> (avg {summary.winner.average})</p>
          ) : <p>No winner yet.</p>}
          <ul>
            {summary.uploads.map(x => <li key={x.uploadId}>{x.title}: avg {x.average} ({x.count} reviews)</li>)}
          </ul>
        </div>
      )}

      <button onClick={clearReviews} style={{ marginTop: 12 }}>Clear All Reviews</button>
    </div>
  );
}
