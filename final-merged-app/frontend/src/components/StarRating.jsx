import React from 'react'

export default function StarRating({ value = 0, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          className={n <= value ? 'star filled' : 'star'}
          onClick={() => onChange && onChange(n)}
        >★</span>
      ))}
    </div>
  )
}
