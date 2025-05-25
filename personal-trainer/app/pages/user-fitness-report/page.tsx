"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import Link from "next/link";

interface UserExercises {
  ExerciseId: number;
  ExerciseName: string;
  ExerciseDate: Date;
  ExerciseTime: number;
  Distance: number;
  Reps: number;
  Weight: number;
}

export default function UserFitnessReport() {
  const [userExercises, setUserExercises] = useState<UserExercises[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("authToken");
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  const fetchUserFitnessReport = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-fitness-report?userId=${userId}`);
      const data = await response.json();

      if (Array.isArray(data.rows)) {
        setUserExercises(data.rows);
      }
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserFitnessReport(userId);
    }
  }, [userId]);

  const thStyle: CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "left",
  };

  const tdStyle: CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <>
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
        <Link href="/pages/dashboard">Back</Link>
      </button>
      <h1>Fitness Report</h1>
      {userExercises.length > 0 ? (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={thStyle}>Exercise Name</th>
              <th style={thStyle}>Exercise Date</th>
              <th style={thStyle}>Exercise Time (min.)</th>
              <th style={thStyle}>Distance (mi.)</th>
              <th style={thStyle}>Reps</th>
              <th style={thStyle}>Weight (lbs.)</th>
            </tr>
          </thead>
          <tbody>
            {userExercises.map((exercise, index) => {
              const formattedDate = formatDate(exercise.ExerciseDate);
              //console.log(exercise.ExerciseDate);
              return (
                <tr key={index}>
                  <td style={tdStyle}>{exercise.ExerciseName}</td>
                  <td style={tdStyle}>{formattedDate}</td>
                  <td style={tdStyle}>{exercise.ExerciseTime}</td>
                  <td style={tdStyle}>{exercise.Distance}</td>
                  <td style={tdStyle}>{exercise.Reps}</td>
                  <td style={tdStyle}>{exercise.Weight}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No exercises found</p>
      )}
    </>
  );
}
