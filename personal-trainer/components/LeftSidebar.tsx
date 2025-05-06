'use client';

import { useState } from 'react';
import SurveyCard from './SurveyCard';
import Link from 'next/link';
import styles from '@/components/Dashboard.module.css';


export default function LeftSidebar() {
  const [showSurvey, setShowSurvey] = useState(false);

  const toggleSurvey = () => {
    setShowSurvey((prev) => !prev);
  };

  return (
    <aside style={{  }}>
      <h2>Fitness Survey</h2>
      <ul>
        <li>Line 1</li>
        <li>Line 2</li>
        <li>Line 3</li>
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
