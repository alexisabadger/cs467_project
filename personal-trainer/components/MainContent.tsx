'use client';
import React, { useEffect, useState, CSSProperties } from 'react';

interface UserExercises {
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

export default function MainContent() {

  const [userExercises, setUserExercises] = useState<UserExercises[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('authToken');
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  useEffect(() => {
    fetch(`/api/user-fitness-plan?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (userId && Array.isArray(data.resultSets)) {
          setUserExercises(data.resultSets);
        }
      })
      .catch((error) => {
        console.error('Error fetching exercise data:', error);
      });
  }, [userId]);

  // // Log the userExercises after it updates
  // useEffect(() => {
  //   console.log(userExercises);
  // }, [userExercises]);
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
    <main style={{}}>
      
      <h1>Daily Workout Plan</h1>
      {userExercises.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
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
          {userExercises.map((exercise, index) => (
            <tr key={index}>
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
    </main>
  );
}

