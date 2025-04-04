import React from 'react'

function Footer() {
  return (
    <footer className=" text-center py-8 bg-gray-900 text-white shadow-lg">
      <p className="text-sm">&copy; {new Date().getFullYear()} CompanyName. All rights reserved.</p>
    </footer>
  )
}

export default Footer