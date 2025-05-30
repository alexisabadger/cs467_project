"use client";
import React, { useEffect, useState, CSSProperties } from "react";
import Select from "react-select";
import styles from "@/components/Dashboard.module.css";

const responsiveTableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const responsiveThStyle: CSSProperties = {
  padding: '12px',
  border: '1px solid #ddd',
  backgroundColor: '#f0f0f0',
  textAlign: 'left',
};

const responsiveTdStyle: CSSProperties = {
  padding: '12px',
  border: '1px solid #ddd',
};

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
  status: string;
  startTime: number | null;
  elapsedSeconds: number;
}

// Define the Option type
interface Option {
  value: number;
  label: string;
}


export default function MainContent() {
  const [userExercises, setUserExercises] = useState<UserExercises[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [exerciseOptions, setExerciseOptions] = useState<Option[]>([]);

  const [isMounted, setIsMounted] = useState(false); // Track if the component is mounted

  const today: string = new Date().toISOString().substring(0, 10);

  // Initialize the table data (an array of rows)
  const [rows, setRows] = useState<ExerciseTracker[]>([
    {
      exerciseId: null,
      exerciseDate: today,
      exerciseName: null,
      exerciseTime: null,
      distance: null,
      reps: null,
      weight: null,
      disableFields: {
        exerciseTime: true,
        distance: true,
        reps: true,
        weight: true,
      },
      status: 'start',
      startTime: null,
      elapsedSeconds: 0,
    },
  ]);

  // Function to add a new row to the table
  const addExercise = () => {
    setRows([
      ...rows,
      {
        exerciseId: null,
        exerciseDate: today,
        exerciseName: null,
        exerciseTime: null,
        distance: null,
        reps: null,
        weight: null,
        disableFields: {
          exerciseTime: true,
          distance: true,
          reps: true,
          weight: true,
        },
        status: 'start',
        startTime: null,
        elapsedSeconds: 0,
      },
    ]);
  };

  // Function to remove a specific row from the table
  const removeExercise = (index: number) => {
    setRows((prevRows) =>
      prevRows.filter((row, prevIndex) => prevIndex !== index)
    );
  };

  const copyExercise = (index: number) => {
    const newRow = rows[index];
    setRows([
      ...rows,
      {
        exerciseId: newRow.exerciseId,
        exerciseDate: newRow.exerciseDate,
        exerciseName: newRow.exerciseName,
        exerciseTime: newRow.exerciseTime,
        distance: newRow.distance,
        reps: newRow.reps,
        weight: newRow.weight,
        disableFields: {
          exerciseTime: newRow.disableFields.exerciseTime,
          distance: newRow.disableFields.distance,
          reps: newRow.disableFields.reps,
          weight: newRow.disableFields.weight,
        },
      status: 'start',
      startTime: null,
      elapsedSeconds: 0,
      },
    ]);
  };

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("authToken");
      setUserId(storedUserId); // Set userId only if available in localStorage
      setIsMounted(true); // Set mounted state to true after the component is mounted
    }
  }, []);

  useEffect(() => {
  if (!userId) return; // Don't fetch if no userId
  
  fetch(`/api/user/${userId}/fitness-plan`)
    .then((response) => response.json())
    .then((data) => {
      if (data.resultSets && Array.isArray(data.resultSets)) {
        setUserExercises(data.resultSets);

        const options = [
          ...data.resultSets.map((record: UserExercises) => ({
            value: record.ExerciseId,
            label: record.ExerciseName,
          })),
        ];
        setExerciseOptions(options);
      } else {
        // Handle empty fitness plan
        setUserExercises([]);
        setExerciseOptions([]);
      }
    })
    .catch((error) => {
      console.error("Error fetching exercise data:", error);
      setUserExercises([]);
      setExerciseOptions([]);
    });
}, [userId]);

  const handleInputChange = (index: number, field: string, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row, prevIndex) =>
        prevIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

const handleExerciseSelect = async (
  userId: string | null,
  selectedOption: Option | null,
  index: number
) => {
  const selectedExerciseId = selectedOption?.value;

  if (selectedExerciseId && userId) {
    try {
      const res = await fetch(
        `/api/user/${userId}/exercise?exerciseId=${selectedExerciseId}`
      );
      const data = await res.json();

      // Check if data.rows exists and has content
      if (data.rows && data.rows.length > 0) {
        const exerciseData = data.rows[0];
        
        setRows((prevRows) =>
          prevRows.map((row, i) =>
            i === index
              ? {
                  ...row,
                  exerciseId: selectedExerciseId,
                  exerciseName: selectedOption?.label,
                  exerciseTime: exerciseData.ExerciseTime ?? null,
                  distance: exerciseData.Distance ?? null,
                  reps: exerciseData.Reps ?? null,
                  weight: exerciseData.Weight ?? null,
                  disableFields: {
                    exerciseTime: exerciseData.ExerciseTime === null || exerciseData.ExerciseTime === 0,
                    distance: exerciseData.Distance === null || exerciseData.Distance === 0,
                    reps: exerciseData.Reps === null || exerciseData.Reps === 0,
                    weight: exerciseData.Weight === null || exerciseData.Weight == 0,
                  },
                  status: 'start',
                  startTime: null,
                  elapsedSeconds: 0,
                }
              : row
          )
        );
      } else {
        console.error('No exercise data found');
      }
    } catch (error) {
      console.error('Error fetching exercise details:', error);
    }
  }
};

// Add Start-Stop Button
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

const createUserExercise = async () => {
    const removeExerciseIndexes: number[] = [];
    const promises = rows.map( async (exercise, index) => {
      const res = await fetch('/api/user-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          userId,
          exerciseId: exercise.exerciseId,
          exerciseDate: exercise.exerciseDate,
          exerciseTime: exercise.exerciseTime,
          distance: exercise.distance,
          reps: exercise.reps,
          weight: exercise.weight,
        }),
      });
      const data = await res.json();
      if (data.success) {
        removeExerciseIndexes.push(index);
      }
    });
    
    // Wait for all fetch requests to complete
    await Promise.all(promises);

    // Remove exercises in reverse order, because as the lowest index is removed,
    // the next index is shifted down to take its place
    for (const exerciseIndex of removeExerciseIndexes.reverse()) {
      removeExercise(exerciseIndex)
    }
};

const toggleExerciseState = (index: number) => {
  setRows(prevRows => {
    const now = Date.now();

    return prevRows.map((row, i) => {
      if (i !== index) {
        return row; // leave other rows unchanged
      }
      if (row.status === 'start') {
        // start → stop
        return { ...row, status: 'stop', startTime: now, elapsedSeconds: 0 };
      } 
      if (row.status === 'stop') {
        // stop → complete
        const elapsedSeconds = Math.floor((now - (row.startTime || now)) / 1000.0)
        const totalTime = Math.round((elapsedSeconds / 60.0) * 100) / 100;
        const completedRow = {
          ...row,
          status: 'start',
          startTime: null,
          exerciseTime: totalTime,
          elapsedSeconds: elapsedSeconds,
        };
        
        return completedRow;
      }
      return row;
    });
    
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
    <main className={`${styles.card} ${styles.mainContent}`}>
      {/* Workout Plan Section */}
      <h1>Workout Plan</h1>
      {userExercises.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.exerciseTable}>
            <thead>
              <tr>
                <th style={responsiveThStyle}>Exercise Name</th>
                <th style={responsiveThStyle}>Exercise Description</th>
                <th style={responsiveThStyle}>Equipment</th>
                <th style={responsiveThStyle}>Fitness Level</th>
                <th style={responsiveThStyle}>Exercise Time (min.)</th>
                <th style={responsiveThStyle}>Distance (mi.)</th>
                <th style={responsiveThStyle}>Sets</th>
                <th style={responsiveThStyle}>Reps</th>
                <th style={responsiveThStyle}>Weight (lbs.)</th>
              </tr>
            </thead>
            <tbody>
              {userExercises.map((exercise, index) => (
                <tr key={index}>
                  <td style={responsiveTdStyle}>{exercise.ExerciseName}</td>
                  <td style={responsiveTdStyle}>{exercise.ExerciseDescription}</td>
                  <td style={responsiveTdStyle}>{exercise.ExerciseEquipmentName}</td>
                  <td style={responsiveTdStyle}>{exercise.FitnessLevel}</td>
                  <td style={responsiveTdStyle}>{exercise.ExerciseTime}</td>
                  <td style={responsiveTdStyle}>{exercise.Distance}</td>
                  <td style={responsiveTdStyle}>{exercise.Sets}</td>
                  <td style={responsiveTdStyle}>{exercise.Reps}</td>
                  <td style={responsiveTdStyle}>{exercise.Weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No exercises found</p>
      )}

      {/* Workout Tracker Section */}
      <h1 className={styles.cardTitle} style={{ marginTop: '2rem' }}>Workout Tracker</h1>
      <div className={styles.tableContainer}>
        <table className={styles.responsiveTable}>
          <thead>
            <tr>
              <th style={responsiveThStyle}>Actions</th>
              <th style={responsiveThStyle}>Date</th>
              <th style={responsiveThStyle}>Exercise</th>
              <th style={responsiveThStyle}>Time (min.)</th>
              <th style={responsiveThStyle}>Distance (mi.)</th>
              <th style={responsiveThStyle}>Reps</th>
              <th style={responsiveThStyle}>Weight (lbs.)</th>
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
                    <button
                        className={styles.button}
                        onClick={() => toggleExerciseState(index)}
                        disabled={row?.status === 'complete'}
                        hidden={row.disableFields?.exerciseTime}
                      >
                        {row?.status === 'stop'
                        ? 'Stop'
                        : row?.status === 'complete'
                        ? 'Complete'
                        : 'Start'}
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
                          minWidth: '200px', // or wider
                          width: '100%',     // full width of the td
                        }),
                        control: (base) => ({
                          ...base,
                          minHeight: '40px',
                          fontSize: '14px'
                        }),
                         menu: (base) => ({
                          ...base,
                          zIndex: 9999, // ensure it isn't clipped
                        }),
                      }}
                    />
                  )}
                </td>
                <td style={responsiveTdStyle} data-label="Time (min)">
                  {row.disableFields?.exerciseTime ? "" : row?.status === 'stop' || row?.status === 'complete' ? `${row.elapsedSeconds}s` : '-'}
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
        <button className={styles.button} type="button" onClick={createUserExercise}>
          Submit
        </button>
        <button className={styles.button} onClick={resetExercises}>
          Reset
        </button>
      </div>
    </main>
  );
}
