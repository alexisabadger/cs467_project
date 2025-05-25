'use client';

import { useState, useEffect } from 'react';
import SurveyCard from './SurveyCard';
import Link from 'next/link';
import styles from '@/components/Dashboard.module.css';

interface ExerciseLog {
  UserExerciseId: number;
  ExerciseDate: string;
  ExerciseName: string;
  Distance?: number;
  Sets?: number;
  Reps?: number;
  Weight?: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function LeftSidebar() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const fitnessLevelMap = ['Beginner', 'Intermediate', 'Advanced'];
  const toggleSurvey = () => {
    setShowSurvey((prev) => !prev);
  };
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('authToken');
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  useEffect(() => {
    const fetchFitnessInfo = async () => {
      if (!userId) return;
      const res = await fetch(`/api/user-survey-info?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setFitnessLevel(fitnessLevelMap[data.fitnessLevelId] || 'Unknown');
      }
    };
    fetchFitnessInfo();
  }, [userId]);
  
  useEffect(() => {
    const fetchExerciseLogs = async () => {
      try {
        const userId = localStorage.getItem('authToken');
        if (!userId) return;

        const response = await fetch(`/api/user-exercise?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch exercise logs');

        const data = await response.json();
        if (data.success && Array.isArray(data.rows)) {
          setExerciseLogs(data.rows);
        } else {
          console.warn('Unexpected API format', data);
        }
      } catch (error) {
        console.error('Error fetching exercise logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseLogs();
  }, []);

  return (
    <aside className={`${styles.card} ${styles.leftSidebar}`}>
      <h2>Fitness Survey</h2>
      <br />
      <ul>
        <li>Fitness Level: {fitnessLevel || 'Not set'}</li>
      </ul>

      <button
        onClick={toggleSurvey}
        className={styles.button}
      >
        {showSurvey ? 'Hide Survey' : 'Take Survey'}
      </button>
      {showSurvey && <SurveyCard />}
      <br />
      <br />
      <h2>Completed Workouts</h2>
      <button className={styles.button}>
        <Link href='/pages/user-fitness-report'>Fitness Report</Link>
      </button>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : exerciseLogs.length > 0 ? (
        <table className={styles.exerciseTable}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Exercise Name</th>
              <th className={styles.th}>Time (sec)</th>
              <th className={styles.th}>Distance (mi)</th>
              <th className={styles.th}>Sets</th>
              <th className={styles.th}>Reps</th>
              <th className={styles.th}>Weight (lbs)</th>
            </tr>
          </thead>
          <tbody>
            {exerciseLogs.map((log) => (
              <tr key={log.UserExerciseId}>
                <td className={styles.td}>{formatDate(log.ExerciseDate)}</td>
                <td className={styles.td}>{log.ExerciseName}</td>
                <td className={styles.td}>{log.Distance ?? '-'}</td>
                <td className={styles.td}>{log.Sets ?? '-'}</td>
                <td className={styles.td}>{log.Reps ?? '-'}</td>
                <td className={styles.td}>{log.Weight ?? '-'}</td>
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
