"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import styles from "@/components/Dashboard.module.css";

interface UserExercises {
  ExerciseId: number;
  ExerciseName: string;
  ExerciseDescription: string;
  ExerciseEquipmentName: string;
  FitnessLevel: string;
  ExerciseTime: number;
  Distance: number;
  Sets: number;
  Reps: number;
  Weight: number;
}

interface ExerciseTracker {
  exerciseId: number | null;
  exerciseDate: string;
  exerciseName: string | null;
  exerciseTime: number | null;
  distance: number | null;
  reps: number | null;
  weight: number | null;
  disableFields: {
    exerciseTime: boolean;
    distance: boolean;
    reps: boolean;
    weight: boolean;
  }
  status: 'start' | 'stop' | 'complete';
  startTime: number | null;
  elapsedSeconds: number;
}

export default function MainContent() {
  const [userExercises, setUserExercises] = useState<UserExercises[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [rows, setRows] = useState<ExerciseTracker[]>([]);

  const today: string = new Date().toISOString().substring(0, 10);

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("authToken");
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  useEffect(() => {
    fetch(`/api/user-fitness-plan?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.resultSets)) {
          setUserExercises(data.resultSets);
        }
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
  }, [userId]);

 useEffect(() => {
    const interval = setInterval(() => {
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.status === 'stop' && row.startTime) {
            const elapsed = Math.floor((Date.now() - row.startTime) / 1000);
            return { ...row, elapsedSeconds: elapsed };
          }
          return row;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const createUserExercise = async (exercise: ExerciseTracker) => {
    await fetch('/api/user-exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        exerciseId: exercise.exerciseId,
        exerciseDate: exercise.exerciseDate,
        startTime: new Date(exercise.startTime).toISOString(),
        stopTime: new Date().toISOString(),
        distance: exercise.distance,
        reps: exercise.reps,
        weight: exercise.weight,
      }),
    });
  };

  const toggleExerciseState = (exerciseId: number) => {
    setRows((prevRows) => {
      const index = prevRows.findIndex((row) => row.exerciseId === exerciseId);
      const now = Date.now();

      if (index !== -1) {
        return prevRows.map((row, i) => {
          if (i !== index) return row;

          if (row.status === 'start') {
            return { ...row, status: 'stop', startTime: now, elapsedSeconds: 0 };
          } else if (row.status === 'stop') {
            const totalTime = Math.floor((now - (row.startTime || now)) / 1000);
            const completedRow = {
              ...row,
              status: 'complete',
              startTime: null,
              exerciseTime: totalTime,
              elapsedSeconds: totalTime,
            };
            createUserExercise(completedRow);
            return completedRow;
          }

          return row;
        });
      } else {
        const exercise = userExercises.find((ex) => ex.ExerciseId === exerciseId);
        return [
          ...prevRows,
          {
            exerciseId,
            exerciseDate: today,
            exerciseName: exercise?.ExerciseName || '',
            exerciseTime: null,
            distance: exercise?.Distance ?? null,
            reps: exercise?.Reps ?? null,
            weight: exercise?.Weight ?? null,
            disableFields: {
              exerciseTime: exercise?.ExerciseTime === 0,
              distance: exercise?.Distance === 0,
              reps: exercise?.Reps === 0,
              weight: exercise?.Weight === 0,
            },
            status: 'stop',
            startTime: now,
            elapsedSeconds: 0,
          },
        ];
      }
    });
  };

  const resetExercises = () => {
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        status: 'start',
        startTime: null,
        elapsedSeconds: 0,
        exerciseTime: null
      }))
    );
};

  return (
    <main className={styles.contentMain}>
      <h1>Daily Workout Plan</h1>
      {userExercises.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th className={styles.th}>Start/Stop</th>
              <th className={styles.th}>Exercise Name</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Equipment</th>
              <th className={styles.th}>Fitness Level</th>
              <th className={styles.th}>Time (sec)</th>
              <th className={styles.th}>Distance (mi)</th>
              <th className={styles.th}>Sets</th>
              <th className={styles.th}>Reps</th>
              <th className={styles.th}>Weight (lbs)</th>
            </tr>
          </thead>
          <tbody>
            {userExercises.map((exercise, index) => {
              const trackedRow = rows.find((r) => r.exerciseId === exercise.ExerciseId);
              const status = trackedRow?.status || 'start';
              const time = trackedRow?.elapsedSeconds ?? exercise.ExerciseTime;

              return (
                <tr key={index}>
                  <td className={styles.td}>
                    <button
                      className={styles.button}
                      onClick={() => toggleExerciseState(exercise.ExerciseId)}
                      disabled={status === 'complete'}
                    >
                      {status === 'start' && 'Start'}
                      {status === 'stop' && 'Stop'}
                      {status === 'complete' && 'Complete'}
                    </button>
                  </td>
                  <td className={styles.td}>{exercise.ExerciseName}</td>
                  <td className={styles.td}>{exercise.ExerciseDescription}</td>
                  <td className={styles.td}>{exercise.ExerciseEquipmentName}</td>
                  <td className={styles.td}>{exercise.FitnessLevel}</td>
                  <td className={styles.td}>{time ?? '-'}</td>
                  <td className={styles.td}>{exercise.Distance}</td>
                  <td className={styles.td}>{exercise.Sets}</td>
                  <td className={styles.td}>{exercise.Reps}</td>
                  <td className={styles.td}>{exercise.Weight}</td>
                </tr>
              );
            })}
          </tbody>
            <tfoot>
              <tr>
                <td>
                  <button className={styles.button} onClick={resetExercises}>
                    Reset
                  </button>
                </td>
              </tr>
            </tfoot>
        </table>
      ) : (
        <p>No exercises found</p>
      )}
    </main>
  );
}