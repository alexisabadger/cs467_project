'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/components/Dashboard.module.css';

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
    <main>
      <h1>Daily Workout Plan</h1>
      {userExercises.length > 0 ? (
        <table className = {styles.exerciseTable}>
        <thead>
          <tr>
            <th className={styles.th}>Exercise Name</th>
            <th className={styles.th}>Exercise Description</th>
            <th className={styles.th}>Equipment</th>
            <th className={styles.th}>Fitness Level</th>
            <th className={styles.th}>Exercise Time (min.)</th>
            <th className={styles.th}>Distance (mi.)</th>
            <th className={styles.th}>Sets</th>
            <th className={styles.th}>Reps</th>
            <th className={styles.th}>Weight (lbs.)</th>
          </tr>
        </thead>
        <tbody>
          {userExercises.map((exercise, index) => (
            <tr key={index}>
              <td className={styles.td}>{exercise.ExerciseName}</td>
              <td className={styles.td}>{exercise.ExerciseDescription}</td>
              <td className={styles.td}>{exercise.ExerciseEquipmentName}</td>
              <td className={styles.td}>{exercise.FitnessLevel}</td>
              <td className={styles.td}>{exercise.ExerciseTime}</td>
              <td className={styles.td}>{exercise.Distance}</td>
              <td className={styles.td}>{exercise.Sets}</td>
              <td className={styles.td}>{exercise.Reps}</td>
              <td className={styles.td}>{exercise.Weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <p>No exercises found</p>
      )}
      <button className={styles.button}>
        <Link href='/pages/modify-fitness-plan'>Modify Fitness Plan</Link>
      </button>
    </main>
  );
}

