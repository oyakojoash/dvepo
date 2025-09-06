import React from 'react'
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      className="search-bar"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}
