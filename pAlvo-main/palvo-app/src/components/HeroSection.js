// Dentro de src/components/Navbar.js
import React from 'react';
// Importe o seu CSS se for usar um arquivo separado para o Navbar
// import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      {/* Você pode usar uma tag <img> para o logo */}
      <div className="navbar-logo">pAlvo</div>
      <div className="navbar-links">
        <a href="/donate">Donate</a>
        <a href="/contato">Contato</a>
        <button className="navbar-entrar-btn">Entrar</button>
      </div>
    </nav>
  );
}

export default Navbar;