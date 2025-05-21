'use client';

import { useEffect, useState } from 'react';
import styles from '@/components/Dashboard.module.css';

interface ExerciseLog {
  UserExerciseId: number;
  ExerciseDate: string;
  ExerciseName: string;
  ExerciseStartTime: string;
  ExerciseStopTime: string;
  Distance?: number;
  Sets?: number;
  Reps?: number;
  Weight?: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function calculateDuration(start: string, stop: string): number {
  const startTime = new Date(start).getTime();
  const stopTime = new Date(stop).getTime();
  const diff = Math.floor((stopTime - startTime) / 1000);
  return isNaN(diff) || diff < 0 ? 0 : diff;
}

export default function RightSidebar() {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);

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
    <aside style={{  }}>
      <h2>Completed Workouts</h2>
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
                <td className={styles.td}>
                  {log.ExerciseStartTime && log.ExerciseStopTime
                  ? calculateDuration(log.ExerciseStartTime, log.ExerciseStopTime)
                  : '-'}
                </td>
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