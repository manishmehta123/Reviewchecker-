import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function ReviewChart({ avgLeft, avgRight, reviews }) {
  const data = [
    { name: 'Left', rating: Number(avgLeft) },
    { name: 'Right', rating: Number(avgRight) },
  ]
  return (
    <div className="chart">
      <div className="small">Average ratings (out of 5) • {reviews} reviews</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0,5]} />
          <Tooltip />
          <Bar dataKey="rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
