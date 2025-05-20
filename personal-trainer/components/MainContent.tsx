"use client";
import React, { useEffect, useState, CSSProperties } from "react";
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
  };
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
        exerciseTime: false,
        distance: false,
        reps: false,
        weight: false,
      },
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
          exerciseTime: false,
          distance: false,
          reps: false,
          weight: false,
        },
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
    fetch(`/api/user-fitness-plan?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (userId && Array.isArray(data.resultSets)) {
          setUserExercises(data.resultSets);

          const options = [
            ...data.resultSets.map((record: UserExercises) => ({
              value: record.ExerciseId,
              label: record.ExerciseName,
            })),
          ];
          setExerciseOptions(options);
        }
      })
      .catch((error) => {
        console.error("Error fetching exercise data:", error);
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

    if (selectedExerciseId) {
      const res = await fetch(
        `/api/user-exercise?userId=${userId}&exerciseId=${selectedExerciseId}`
      );
      const data = await res.json();

      setRows((prevRows) =>
        prevRows.map((row, i) =>
          i === index
            ? {
                ...row,
                exerciseId: selectedExerciseId,
                exerciseName: selectedOption?.label,
                exerciseTime: data.rows[0].ExerciseTime,
                distance: data.rows[0].Distance,
                reps: data.rows[0].Reps,
                weight: data.rows[0].Weight,
                disableFields: {
                  exerciseTime: data.rows[0].ExerciseTime === null || data.rows[0].ExerciseTime === 0,
                  distance: data.rows[0].Distance === null || data.rows[0].Distance === 0,
                  reps: data.rows[0].Reps === null || data.rows[0].Reps === 0,
                  weight: data.rows[0].Weight === null || data.rows[0].Weight == 0,
                },
              }
            : row
        )
      );
    }
  };

  // // Log the userExercises after it updates
  // useEffect(() => {
  //   console.log(userExercises);
  // }, [userExercises]);
  const thStyle: CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "left",
  };

  const tdStyle: CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
  };

  return (
    <main style={{}}>
      <h1>Workout Plan</h1>
      {userExercises.length > 0 ? (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
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
      <br />
      <h1>Workout Tracker</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>Actions</th>
            <th style={thStyle}>Exercise Date</th>
            <th style={thStyle}>Exercise Name</th>
            <th style={thStyle}>Exercise Time (min.)</th>
            <th style={thStyle}>Distance (mi.)</th>
            <th style={thStyle}>Reps</th>
            <th style={thStyle}>Weight (lbs.)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={tdStyle}>
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
              </td>
              <td style={tdStyle}>
                <input
                  type="date"
                  value={row.exerciseDate}
                  onChange={(e) =>
                    handleInputChange(index, "exerciseDate", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                {isMounted && (
                  <Select
                    options={exerciseOptions}
                    value={exerciseOptions.find(
                      (option) => option.value === row.exerciseId
                    )}
                    onChange={(selectedOption) =>
                      handleExerciseSelect(userId, selectedOption, index)
                    }
                  />
                )}
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={row.exerciseTime || ""}
                  disabled={row.disableFields?.exerciseTime}
                  onChange={(e) =>
                    handleInputChange(index, "exerciseTime", +e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={row.distance || ""}
                  disabled={row.disableFields?.distance}
                  onChange={(e) =>
                    handleInputChange(index, "distance", +e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={row.reps || ""}
                  disabled={row.disableFields?.reps}
                  onChange={(e) =>
                    handleInputChange(index, "reps", +e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={row.weight || ""}
                  disabled={row.disableFields?.weight}
                  onChange={(e) =>
                    handleInputChange(index, "weight", +e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.button} type="button" onClick={addExercise}>
        Add Row
      </button>
      <button className={styles.button} type="button" onClick={addExercise}>
        Submit
      </button>
    </main>
  );
}
