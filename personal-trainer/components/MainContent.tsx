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
<<<<<<< Updated upstream
      <button className={styles.button}>
        <Link href='/pages/modify-fitness-plan'>Modify Fitness Plan</Link>
      </button>
=======

      {/* Workout Tracker Section */}
      <h1 className={styles.cardTitle} style={{ marginTop: '2rem' }}>Workout Tracker</h1>
      <div className={styles.tableContainer}>
        <table className={styles.responsiveTable}>
          <thead>
            <tr>
              <th style={responsiveThStyle}>Actions</th>
              <th style={responsiveThStyle}>Date</th>
              <th style={responsiveThStyle}>Exercise</th>
              <th style={responsiveThStyle}>Time</th>
              <th style={responsiveThStyle}>Distance</th>
              <th style={responsiveThStyle}>Reps</th>
              <th style={responsiveThStyle}>Weight</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td style={responsiveTdStyle} data-label="Actions">
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.button}
                      type="button"
                      onClick={() => removeExercise(index)}
                    >
                      Remove
                    </button>
                    <button
                      className={styles.button}
                      type="button"
                      onClick={() => copyExercise(index)}
                    >
                      Copy
                    </button>
                  </div>
                </td>
                <td style={responsiveTdStyle} data-label="Date">
                  <input
                    type="date"
                    value={row.exerciseDate}
                    onChange={(e) =>
                      handleInputChange(index, "exerciseDate", e.target.value)
                    }
                    className={styles.inputField}
                  />
                </td>
                <td style={responsiveTdStyle} data-label="Exercise">
                  {isMounted && (
                    <Select
                      options={exerciseOptions}
                      value={exerciseOptions.find(
                        (option) => option.value === row.exerciseId
                      )}
                      onChange={(selectedOption) =>
                        handleExerciseSelect(userId, selectedOption, index)
                      }
                      classNamePrefix="react-select"
                      styles={{
                       container: (base) => ({
                        ...base,
                        minWidth: '200px', 
                        width: '100%',  
                      }),
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          fontSize: '14px',
                      }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999, 
                        })
                      }}
                    />
                  )}
                </td>
                <td style={responsiveTdStyle} data-label="Time (min)">
                  <input
                    type="number"
                    value={row.exerciseTime || ""}
                    disabled={row.disableFields?.exerciseTime}
                    onChange={(e) =>
                      handleInputChange(index, "exerciseTime", +e.target.value)
                    }
                    className={styles.inputField}
                  />
                </td>
                <td style={responsiveTdStyle} data-label="Distance (mi)">
                  <input
                    type="number"
                    value={row.distance || ""}
                    disabled={row.disableFields?.distance}
                    onChange={(e) =>
                      handleInputChange(index, "distance", +e.target.value)
                    }
                    className={styles.inputField}
                  />
                </td>
                <td style={responsiveTdStyle} data-label="Reps">
                  <input
                    type="number"
                    value={row.reps || ""}
                    disabled={row.disableFields?.reps}
                    onChange={(e) =>
                      handleInputChange(index, "reps", +e.target.value)
                    }
                    className={styles.inputField}
                  />
                </td>
                <td style={responsiveTdStyle} data-label="Weight (lbs)">
                  <input
                    type="number"
                    value={row.weight || ""}
                    disabled={row.disableFields?.weight}
                    onChange={(e) =>
                      handleInputChange(index, "weight", +e.target.value)
                    }
                    className={styles.inputField}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.button} type="button" onClick={addExercise}>
          Add Row
        </button>
        <button className={styles.button} type="button" onClick={addExercise}>
          Submit
        </button>
      </div>
>>>>>>> Stashed changes
    </main>
  );
}

