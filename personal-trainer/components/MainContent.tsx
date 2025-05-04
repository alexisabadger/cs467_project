'use client';
import React, { useEffect, useState } from 'react';

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

  return (
    <main style={{}}>
      <h1>Daily Workout Plan</h1>
      {userExercises.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Exercise Name</th>
              <th>Exercise Description</th>
              <th>Equipment</th>
              <th>Fitness Level</th>
              <th>Exercise Time (min.)</th>
              <th>Distance (mi.)</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Weight (lbs.)</th>
            </tr>
          </thead>
          <tbody>
            {userExercises.map((exercise, index) => (
              <tr key={index}>
                <td>{exercise.ExerciseName}</td>
                <td>{exercise.ExerciseDescription}</td>
                <td>{exercise.ExerciseEquipmentName}</td>
                <td>{exercise.FitnessLevel}</td>
                <td>{exercise.ExerciseTime}</td>
                <td>{exercise.Distance}</td>
                <td>{exercise.Sets}</td>
                <td>{exercise.Reps}</td>
                <td>{exercise.Weight}</td>
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

