"use client";
import { useState } from "react";
import SurveyCard from "./SurveyCard";
import Link from "next/link";

export default function LeftSidebar() {
  const [showSurvey, setShowSurvey] = useState(false);

  const toggleSurvey = () => {
    setShowSurvey((prev) => !prev);
  };

  return (
    <aside style={{}}>
      <h2>Fitness Survey</h2>
      <ul>
        <li>Line 1</li>
        <li>Line 2</li>
        <li>Line 3</li>
      </ul>

      <button
        onClick={toggleSurvey}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {showSurvey ? "Hide Survey" : "Take Survey"}
      </button>

      {showSurvey && <SurveyCard />}

      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <Link href="/pages/modify-fitness-plan">Modify Fitness Plan</Link>
      </button>
    </aside>
  );
}
