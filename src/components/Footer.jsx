import React from 'react'

const Footer = (color) => {
  return (
    <div style={color ? {backgroundColor: color} : ''}>
        <p style={{color: "#14121e", margin: '20px', textAlign: 'center'}}>LinkScape©2024</p>
    </div>
  )
}

export default Footer