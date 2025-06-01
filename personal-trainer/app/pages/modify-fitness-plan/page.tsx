'use client';
import React, { useEffect, useState, CSSProperties } from 'react';
import Link from 'next/link';

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

export default function FitnessPlan() {
  const [userExercises, setUserExercises] = useState<UserExercises[]>([]);
  const [userExerciseOptions, setUserExerciseOptions] = useState<
    UserExercises[]
  >([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [editableExercises, setEditableExercises] = useState<
    Record<number, Partial<UserExercises>>
  >({});

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('authToken');
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  const fetchUserExercises = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}/fitness-plan`);
      const data = await response.json();
      if (data.resultSets && Array.isArray(data.resultSets)) {
        setUserExercises(data.resultSets);
      } else {
        setUserExercises([]);
      }
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      setUserExercises([]);
    }
  };

  const fetchUserExerciseOptions = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-exercise-options?userId=${userId}`);
      const data = await response.json();
      if (data.rows && Array.isArray(data.rows)) {
        setUserExerciseOptions(data.rows);
      } else {
        setUserExerciseOptions([]);
      }
    } catch (error) {
      console.error('Error fetching exercise options data:', error);
      setUserExerciseOptions([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserExercises(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserExerciseOptions(userId);
    }
  }, [userId]);

  const handleInputChange = (
    exerciseId: number,
    field: keyof UserExercises,
    value: string | number
  ) => {
    setEditableExercises((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }));
  };

  const addExercise = async (exerciseId: number) => {
    if (!userId) return;

    await fetch('/api/user-exercise-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, exerciseId }),
    });

    // Refresh the fitness plan table
    fetchUserExercises(userId);
    fetchUserExerciseOptions(userId);
  };

  const deleteExercise = async (exerciseId: number) => {
    if (!userId) return;

    await fetch('/api/user-exercise-options', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, exerciseId }),
    });

    // Refresh the fitness plan table
    fetchUserExercises(userId);
    fetchUserExerciseOptions(userId);
  };

  const updateExercise = async (
    exerciseId: number,
    exerciseTime: number,
    distance: number,
    sets: number,
    reps: number,
    weight: number
  ) => {
    if (!userId) return;

    try {
      const res = await fetch('/api/user-exercise-options', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          exerciseId,
          exerciseTime,
          distance,
          sets,
          reps,
          weight,
        }),
      });

      if (res.ok) {
        await fetchUserExercises(userId); // Refresh table
        setEditableExercises((prev) => {
          const updated = { ...prev };
          delete updated[exerciseId];
          return updated;
        });
      } else {
        console.error('Failed to update exercise');
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

    const thStyle: CSSProperties = {
      border: '1px solid #ccc',
      padding: '8px',
      backgroundColor: '#f0f0f0',
      textAlign: 'left',
    };
    
    const tdStyle: CSSProperties = {
      border: '1px solid #ccc',
      padding: '8px',
    };

  return (
    <>
      <button
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <Link href='/pages/dashboard'>Back</Link>
      </button>
      <h1>Current Fitness Plan</h1>
      {userExercises.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={thStyle}></th>
              <th style={thStyle}></th>
              <th style={thStyle}>Exercise Name</th>
              <th style={thStyle}>Exercise Description</th>
              <th style={thStyle}>Equipment</th>
              <th style={thStyle}>Fitness Level</th>
              <th style={thStyle}>Exercise Time (min.)</th>
              <th style={thStyle}>Distance (mi.)</th>
              <th style={thStyle}>Sets</th>
              <th style={thStyle}>Reps</th>
              <th style={thStyle}>Weight (lbs.)</th>
            </tr>
          </thead>
          <tbody>
            {userExercises.map((exercise, index) => {
              const editable = editableExercises[exercise.ExerciseId] || {};

              return (
                <tr key={index}>
                  <td style={tdStyle}>
                    <button
                      onClick={() => deleteExercise(exercise.ExerciseId)}
                      style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete Exercise
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        updateExercise(
                          exercise.ExerciseId,
                          editable.ExerciseTime ?? exercise.ExerciseTime,
                          editable.Distance ?? exercise.Distance,
                          editable.Sets ?? exercise.Sets,
                          editable.Reps ?? exercise.Reps,
                          editable.Weight ?? exercise.Weight
                        )
                      }
                      style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Update Exercise
                    </button>
                  </td>
                  <td style={tdStyle}>{exercise.ExerciseName}</td>
                  <td style={tdStyle}>{exercise.ExerciseDescription}</td>
                  <td style={tdStyle}>{exercise.ExerciseEquipmentName}</td>
                  <td style={tdStyle}>{exercise.FitnessLevel}</td>
                  <td style={tdStyle}>
                    <input
                      type='number'
                      value={
                        editable.ExerciseTime ?? exercise.ExerciseTime ?? ''
                      }
                      onChange={(e) =>
                        handleInputChange(
                          exercise.ExerciseId,
                          'ExerciseTime',
                          +e.target.value
                        )
                      }
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type='number'
                      value={editable.Distance ?? exercise.Distance ?? ''}
                      onChange={(e) =>
                        handleInputChange(
                          exercise.ExerciseId,
                          'Distance',
                          +e.target.value
                        )
                      }
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type='number'
                      value={editable.Sets ?? exercise.Sets ?? ''}
                      onChange={(e) =>
                        handleInputChange(
                          exercise.ExerciseId,
                          'Sets',
                          +e.target.value
                        )
                      }
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type='number'
                      value={editable.Reps ?? exercise.Reps ?? ''}
                      onChange={(e) =>
                        handleInputChange(
                          exercise.ExerciseId,
                          'Reps',
                          +e.target.value
                        )
                      }
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type='number'
                      value={editable.Weight ?? exercise.Weight ?? ''}
                      onChange={(e) =>
                        handleInputChange(
                          exercise.ExerciseId,
                          'Weight',
                          +e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No exercises found</p>
      )}
      <h1 style={{ marginTop: '100px' }}>Exercise Options</h1>
      {userExerciseOptions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th style={thStyle}></th>
              <th style={thStyle}>Exercise Name</th>
              <th style={thStyle}>Exercise Description</th>
              <th style={thStyle}>Equipment</th>
              <th style={thStyle}>Fitness Level</th>
              <th style={thStyle}>Exercise Time (min.)</th>
              <th style={thStyle}>Distance (mi.)</th>
              <th style={thStyle}>Sets</th>
              <th style={thStyle}>Reps</th>
              <th style={thStyle}>Weight (lbs.)</th>
            </tr>
          </thead>
          <tbody>
            {userExerciseOptions.map((exercise, index) => (
              <tr key={index}>
                <td style={tdStyle}>
                  <button
                    onClick={() => addExercise(exercise.ExerciseId)}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#0070f3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Add Exercise
                  </button>
                </td>
                <td style={tdStyle}>{exercise.ExerciseName}</td>
                <td style={tdStyle}>{exercise.ExerciseDescription}</td>
                <td style={tdStyle}>{exercise.ExerciseEquipmentName}</td>
                <td style={tdStyle}>{exercise.FitnessLevel}</td>
                <td style={tdStyle}>{exercise.ExerciseTime}</td>
                <td style={tdStyle}>{exercise.Distance}</td>
                <td style={tdStyle}>{exercise.Sets}</td>
                <td style={tdStyle}>{exercise.Reps}</td>
                <td style={tdStyle}>{exercise.Weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No exercises found</p>
      )}
    </>
  );
}
