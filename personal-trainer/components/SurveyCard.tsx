'use client';
import { useState } from 'react';
import styles from '@/components/Dashboard.module.css';

export default function SurveyCard() {
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const userId = localStorage.getItem('authToken');

  const handleCheckboxChange = (goal: string) => {
    setFitnessGoals((prevGoals) =>
      prevGoals.includes(goal)
        ? prevGoals.filter((g) => g !== goal)
        : [...prevGoals, goal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fitnessLevel) {
      alert('Please select your fitness level.');
      return;
    }

    // console.log("Fitness Level:", fitnessLevel);
    // console.log("Fitness Goals:", fitnessGoals);
    setSubmitted(true);

    const res = await fetch('/api/user-fitness-goal-exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, fitnessLevel, fitnessGoals }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Created fitness plan.');
    }
  };

  return (
    <div className = {styles.card}>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {/* Fitness Level (Radio Buttons) */}
          <div style={{ marginBottom: '1rem' }}>
            <p>
              <strong>What is your level of fitness? (select one)</strong>
            </p>
            {['Beginner', 'Intermediate', 'Advanced'].map((level, index) => (
              <label
                key={level}
                style={{ display: 'block', marginBottom: '0.25rem' }}
              >
                <input
                  type='radio'
                  name='fitnessLevel'
                  value={index}
                  checked={fitnessLevel === String(index)}
                  onChange={() => setFitnessLevel(String(index))}
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
            {['Strength', 'Weight-loss', 'Flexibility', 'Mindfulness'].map(
              (goal, index) => (
                <label
                  key={goal}
                  style={{ display: 'block', marginBottom: '0.25rem' }}
                >
                  <input
                    type='checkbox'
                    value={index}
                    checked={fitnessGoals.includes(String(index))}
                    onChange={() => handleCheckboxChange(String(index))}
                  />{' '}
                  {goal}
                </label>
              ))}
            </div>
  
            <button type="submit" className={styles.button}>Submit</button>
          </form>
        ) : (
          <div>
            <p>Submitted!</p>
          </div>
        )}
      </div>
    );
  }
