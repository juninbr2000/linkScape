import React from 'react'

const Footer = (color) => {
  return (
    <div style={color ? {backgroundColor: color} : ''}>
        <p style={{color: "#14121e", margin: '20px', textAlign: 'center', 'boxSizing': 'border-box'}}>LinkScape©2025</p>
    </div>
  )
}

export default Footer