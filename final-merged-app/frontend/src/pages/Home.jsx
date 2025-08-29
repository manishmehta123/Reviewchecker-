import React, { useEffect, useState } from "react";
import api from "../api";

function ReviewForm({ uploadId, onDone }) {
  const [form, setForm] = useState({ reviewerName: "", rating: 5, comment: "" });
  const submit = async (e) => {
    e.preventDefault();
    await api.post(`/reviews/${uploadId}`, form);
    setForm({ reviewerName: "", rating: 5, comment: "" });
    onDone();
  };
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 6, maxWidth: 360 }}>
      <input placeholder="Your name (optional)" value={form.reviewerName} onChange={e=>setForm({...form, reviewerName:e.target.value})} />
      <input type="number" min="1" max="5" value={form.rating} onChange={e=>setForm({...form, rating:Number(e.target.value)})} />
      <textarea placeholder="Comment" value={form.comment} onChange={e=>setForm({...form, comment:e.target.value})} />
      <button>Submit Review</button>
    </form>
  );
}

function UploadCard({ upload }) {
  const [reviews, setReviews] = useState([]);
  const load = async () => {
    const r = await api.get(`/reviews/public/${upload._id}`);
    setReviews(r.data);
  };
  useEffect(()=>{ load(); }, [upload._id]);
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16 }}>
      <h3>{upload.title}</h3>
      <p>{upload.description}</p>
      <h4>Public Reviews</h4>
      <ul>
        {reviews.map(rv => <li key={rv._id}><strong>{rv.reviewerName || "Anonymous"}</strong>: {rv.rating}/5 – {rv.comment}</li>)}
      </ul>
      <ReviewForm uploadId={upload._id} onDone={load} />
    </div>
  );
}

export default function Home() {
  const [uploads, setUploads] = useState([]);
  useEffect(() => {
    api.get("/uploads/public").then(res => setUploads(res.data));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Homepage</h2>
      <p>Items uploaded by the <strong>owner</strong> appear here. Anyone can post reviews below each item.</p>
      {uploads.map(u => <UploadCard key={u._id} upload={u} />)}
      {!uploads.length && <em>No owner uploads yet.</em>}
    </div>
  );
}
