import React from 'react'
import './Navbar.css'

export default function Navbar({ activePage, onNavigate, pages }) {
  return (
    <header className="minimal-top-navbar" aria-label="Global Navigation">
      <nav className="minimal-nav-links">
        {pages.map((page) => (
          <button
            key={page.id}
            className={`minimal-nav-link ${activePage === page.id ? 'active' : ''}`}
            onClick={() => onNavigate(page.id)}
            aria-current={activePage === page.id ? 'page' : undefined}
          >
            {page.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
