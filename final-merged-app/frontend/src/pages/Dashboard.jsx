import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    api.get("/uploads/my").then(res => setUploads(res.data));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>My Data</h2>
      <p>Only you can see this list. (Filtered by your user id)</p>
      <ul>
        {uploads.map(u => <li key={u._id}>{u.title} – {u.description}</li>)}
      </ul>
      {!uploads.length && <em>No items yet.</em>}
    </div>
  );
}
