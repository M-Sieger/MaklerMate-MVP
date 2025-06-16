import React from 'react';
import '../styles/Loader.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <p className="loader-text">GPT denkt nach...</p>
    </div>
  );
}
