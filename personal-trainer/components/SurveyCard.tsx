'use client';
import { useState, useEffect } from 'react';
import styles from '@/components/Dashboard.module.css';

export default function SurveyCard() {
  const [fitnessLevel, setFitnessLevel] = useState<number | null>(null);
  const [fitnessGoals, setFitnessGoals] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setUserId(token); // Set userId only if available in localStorage
  }, []);

  const fitnessLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ];
  const fitnessGoalOptions = [
    'Strength',
    'Weight-loss',
    'Flexibility',
    'Mindfulness',
  ];

  const handleCheckboxChange = (goalIndex: number) => {
    setFitnessGoals((prevGoals) =>
      prevGoals.includes(goalIndex)
        ? prevGoals.filter((g) => g !== goalIndex)
        : [...prevGoals, goalIndex]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fitnessLevel === null) {
      alert('Please select your fitness level.');
      return;
    }

    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    // console.log("Fitness Level:", fitnessLevel);
    // console.log("Fitness Goals:", fitnessGoals);
    setIsLoading(true);

    try {
      const res = await fetch('/api/user-fitness-goal-exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, 
                               fitnessLevel, 
                               fitnessGoals 
                              }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        alert('Created fitness plan.');
        setSubmitted(true);
        window.location.reload();
      } else {
        throw new Error(data.error || 'Failed to create fitness plan');
      }
    } catch (error) {
      console.error('Error creating fitness plan: ', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (userId === null) {
    return (<div className={styles.card}>Loading...</div>);
  }

  return (
    <div className = {styles.card}>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {/* Fitness Level (Radio Buttons) */}
          <div style={{ marginBottom: '1rem' }}>
            <p>
              <strong>What is your level of fitness? (select one)</strong>
            </p>
            {fitnessLevels.map((level, index) => (
              <label
                key={index}
                style={{ display: 'block', marginBottom: '0.25rem' }}
              >
                <input
                  type='radio'
                  name='fitnessLevel'
                  value={index}
                  checked={fitnessLevel === index}
                  onChange={() => setFitnessLevel(index)}
                />{' '}
                {level}
              </label>
            ))}
          </div>

          {/* Fitness Goals (Checkboxes) */}
          <div style={{ marginBottom: '1rem' }}>
            <p>
              <strong>What are your fitness goals? (select one or more)</strong>
            </p>
            {fitnessGoalOptions.map((goal, index) => (
              <label
                key={goal}
                style={{ display: 'block', marginBottom: '0.25rem' }}
              >
                <input
                  type='checkbox'
                  value={index}
                  checked={fitnessGoals.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />{' '}
                {goal}
              </label>
            ))}
            </div>
  
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        ) : (
          <div>
            <p>Submitted!</p>
          </div>
        )}
      </div>
    );
  }
