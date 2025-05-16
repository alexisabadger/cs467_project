'use client';

import { useState, useEffect } from 'react';
import SurveyCard from './SurveyCard';
import Link from 'next/link';
import styles from '@/components/Dashboard.module.css';


export default function LeftSidebar() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const fitnessLevelMap = ['Beginner', 'Intermediate', 'Advanced'];


  const toggleSurvey = () => {
    setShowSurvey((prev) => !prev);
  };

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('authToken');
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  useEffect(() => {
    const fetchFitnessInfo = async () => {
      if (!userId) return;
      const res = await fetch(`/api/user-survey-info?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setFitnessLevel(fitnessLevelMap[+data.fitnessLevelId] || 'Unknown');
      }
    };
    fetchFitnessInfo();
  }, [userId]);
  
  return (
    <aside style={{  }}>
      <h2>Fitness Survey</h2>
      <br />
      <ul>
        <li>Fitness Level: {fitnessLevel || 'Not set'}</li>
      </ul>

      <button
        onClick={toggleSurvey}
        className={styles.button}
      >
        {showSurvey ? 'Hide Survey' : 'Take Survey'}
      </button>

      {showSurvey && <SurveyCard />}

      <button className={styles.button}>
        <Link href='/pages/modify-fitness-plan'>Modify Fitness Plan</Link>
      </button>
    </aside>
  );
}
