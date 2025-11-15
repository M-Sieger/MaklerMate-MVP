import React from "react";
import ToolCards from "../components/ToolCards";

export default function ToolHub() {
  return (
    <div className="toolhub-container">
      <h1>🧠 MaklerMate – Deine Tools</h1>
      <p>Wähle ein Tool:</p>
      <ToolCards />
    </div>
  );
}
