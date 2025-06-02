"use client";

import { useState, useEffect, CSSProperties } from "react";
import SurveyCard from "./SurveyCard";
import Link from "next/link";
import styles from "@/components/Dashboard.module.css";

interface UserExercises {
  ExerciseId: number;
  ExerciseName: string;
  ExerciseDate: Date;
  ExerciseTime: number;
  Distance: number;
  Reps: number;
  Weight: number;
}

export default function LeftSidebar() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState("");
  const fitnessLevelMap = ["Beginner", "Intermediate", "Advanced"];
  const toggleSurvey = () => {
    setShowSurvey((prev) => !prev);
  };
  const [userExercises, setUserExercises] = useState<UserExercises[]>([]);
  const [loading, setLoading] = useState(true);

  const today: string = new Date().toISOString().substring(0, 10);

  const responsiveThStyle: CSSProperties = {
    padding: "3px",
    border: "1px solid #ddd",
    backgroundColor: "#f0f0f0",
    textAlign: "left",
  };

  const responsiveTdStyle: CSSProperties = {
    padding: "3px",
    border: "1px solid #ddd",
  };

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("authToken");
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  useEffect(() => {
    const fetchFitnessInfo = async () => {
      if (!userId) return;
      const res = await fetch(`/api/user-survey-info?userId=${userId}`);
      const data = await res.json();

      console.log('API Response:', data);

      if (data.rows && data.rows[0]) {
        const user = data.rows[0];
        setFitnessLevel(user.FitnessLevel || "Not set");
      } else {
        console.error("No fitness level data found for user:", userId);
      }
    };
    fetchFitnessInfo();
  }, [userId]);

  const fetchUserFitnessReport = async (userId: string) => {
    try {
      const response = await fetch(
        `/api/user-fitness-report?userId=${userId}&exerciseDate=${today}`
      );
      const data = await response.json();

      if (Array.isArray(data.rows)) {
        setUserExercises(data.rows);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserFitnessReport(userId);

      // Use polling to fetch new user exercises every few seconds
      const intervalId = setInterval(() => {
        fetchUserFitnessReport(userId);
      }, 5000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <aside className={`${styles.card} ${styles.leftSidebar}`}>
      <h2>Fitness Survey</h2>
      <br />
      <ul>
        <li>Fitness Level: {fitnessLevel || "Not set"}</li>
      </ul>

      <button onClick={toggleSurvey} className={styles.button}>
        {showSurvey ? "Hide Survey" : "Take Survey"}
      </button>
      {showSurvey && <SurveyCard />}
      <br />
      <br />
      <button className={styles.button}>
        <Link href="/pages/user-fitness-report">Fitness Report</Link>
      </button>
      <br />
      <br />
      {formatDate(new Date())}
      {loading ? (
        <p>Loading...</p>
      ) : userExercises.length > 0 ? (
        <table className={styles.exerciseTable}>
          <thead>
            <tr>
              <th style={responsiveThStyle}>Exercise</th>
              <th style={responsiveThStyle}>Time</th>
              <th style={responsiveThStyle}>Distance</th>
              <th style={responsiveThStyle}>Reps</th>
              <th style={responsiveThStyle}>Weight</th>
            </tr>
          </thead>
          <tbody>
            {userExercises.map((exercise, index) => (
              <tr key={index}>
                <td style={responsiveTdStyle}>{exercise.ExerciseName}</td>
                <td style={responsiveTdStyle}>{exercise.ExerciseTime}</td>
                <td style={responsiveTdStyle}>{exercise.Distance}</td>
                <td style={responsiveTdStyle}>{exercise.Reps}</td>
                <td style={responsiveTdStyle}>{exercise.Weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No completed Exercises found.</p>
      )}
    </aside>
  );
}
