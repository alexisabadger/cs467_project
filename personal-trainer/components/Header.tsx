'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/components/Dashboard.module.css';
import Link from 'next/link';

const Header: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Ensure we are running this only on the client-side
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('authToken');
      setUserId(storedUserId); // Set userId only if available in localStorage
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      const res = await fetch(`/api/user/${userId}/profile`);
      const data = await res.json();

      if (data.success) {
        setUsername(data.user.FirstName + ' ' + data.user.LastName);
      } 
    }

    fetchUser();
  }, [userId]);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1>Cross-Platform Personal Trainer Dashboard</h1>
      </div>
      <div className={styles.headerRight}>
        {username && `${username}`}
        <br/>
        <button className={styles.button}>
          <Link href='/pages/modify-fitness-plan'>Modify Fitness Plan</Link>
        </button>
        <button className={styles.button}>
          <Link href='/'>Log Out</Link>
        </button>
      </div>
    </header>
  );
};

export default Header;