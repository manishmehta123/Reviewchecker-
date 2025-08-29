import React, { useEffect, useState } from 'react'
import api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import StarRating from './StarRating.jsx'
import ReviewChart from './ReviewChart.jsx'

export default function BattleCard({ battle, onChange }) {
  const { user } = useAuth()
  const [leftRating, setLeftRating] = useState(0)
  const [rightRating, setRightRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)
  const isOwner = user && battle.owner === user.id

  const loadReviews = async () => {
    const { data } = await api.get(`/battles/${battle._id}/reviews`)
    setReviews(data)
  }

  useEffect(() => {
    loadReviews()
  }, [battle._id])

  const submitReview = async () => {
    try {
      if (!user) return setError('Please log in to review.')
      setError('')
      await api.post(`/battles/${battle._id}/reviews`, { ratingLeft: leftRating, ratingRight: rightRating, comment })
      setLeftRating(0); setRightRating(0); setComment('')
      await loadReviews()
      onChange && onChange()
    } catch (e) {
      setError(e?.response?.data?.error || 'Error submitting review')
    }
  }

  const clearReviews = async () => {
    if (!confirm('Clear all reviews for this battle?')) return
    await api.delete(`/battles/${battle._id}/reviews`)
    await loadReviews()
    onChange && onChange()
  }

  return (
    <div className="battle-card">
      <div className="battle-header">
        <div>
          <div className="battle-title">{battle.title}</div>
          <div className="small">Winner: <span className={
            battle.stats?.winner === 'Left' ? 'winner left' : battle.stats?.winner === 'Right' ? 'winner right' : 'winner draw'
          }>{battle.stats?.winner}</span></div>
        </div>
        <div className="badge">{battle.stats?.reviews || 0} reviews</div>
      </div>

      <div className="compare">
        <div className="image-col">
          <img src={battle.left.url} alt="left" className="image" />
          <div className="caption">{battle.left.caption || 'Left'}</div>
          <div className="avg">Avg: {battle.stats?.avgLeft ?? 0}</div>
        </div>
        <div className="vs">VS</div>
        <div className="image-col">
          <img src={battle.right.url} alt="right" className="image" />
          <div className="caption">{battle.right.caption || 'Right'}</div>
          <div className="avg">Avg: {battle.stats?.avgRight ?? 0}</div>
        </div>
      </div>

      <ReviewChart avgLeft={battle.stats?.avgLeft || 0} avgRight={battle.stats?.avgRight || 0} reviews={battle.stats?.reviews || 0} />

      <div className="rate-row">
        <div className="rate-col">
          <span className="small">Rate Left</span>
          <StarRating value={leftRating} onChange={setLeftRating} />
        </div>
        <div className="rate-col">
          <span className="small">Rate Right</span>
          <StarRating value={rightRating} onChange={setRightRating} />
        </div>
      </div>
      <textarea className="input" placeholder="Write your comment…" value={comment} onChange={e=>setComment(e.target.value)}></textarea>
      {error && <div className="error">{error}</div>}
      <div className="actions">
        <button className="btn" onClick={submitReview}>Submit Review</button>
        {isOwner && <button className="ghost danger" onClick={clearReviews}>Clear All Reviews</button>}
        <button className="ghost" onClick={()=>setExpanded(x=>!x)}>{expanded ? 'Hide' : 'Show'} Comments</button>
      </div>

      {expanded && (
        <div className="comments">
          {reviews.length === 0 ? <div className="empty">No comments yet.</div> : reviews.map(r => (
            <div key={r._id} className="comment">
              <div className="comment-head"><b>{r.reviewer?.name || 'Anon'}</b> <span className="small">{new Date(r.createdAt).toLocaleString()}</span></div>
              <div className="small">Left: {r.ratingLeft} ★ • Right: {r.ratingRight} ★</div>
              <div>{r.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
