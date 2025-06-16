import React from 'react';
import '../styles/Navbar.css';


const Navbar = () => (
  <header className="navbar">
    <div className="logo">GPT Webtools</div>
    <nav>
      <ul>
        <li><a href="#hero">Start</a></li>
        <li><a href="#tools">Demos</a></li>
        <li><a href="#kontakt">Kontakt</a></li>
      </ul>
    </nav>
  </header>
);

export default Navbar;
