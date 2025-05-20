'use client';
import React from 'react';
import Link from 'next/link';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;

    const res = await fetch('/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      // Set token here
      localStorage.setItem('authToken', data.data[0].UserId);

      router.push('/pages/dashboard');
    } else {
      alert('Authentication failed: ' + (data.error || 'Invalid credentials'));
    }
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.title}>
        Cross-Platform Personal Trainer Webapp
      </div>

      <div className={styles.bodyGrid}>
        <div className={styles.loginHeader}>Log in</div>
        <div className={styles.body}>
          <div className={styles.FormLogIn}>
            <form onSubmit={handleSignIn}>
              <div className={styles.inputField}>
                <div className={styles.label}>Email</div>
                <div className={styles.input}>
                  <div className={styles.textWrapper}>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      required
                      placeholder='Your email here'
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className={styles.inputField}>
                <div className={styles.label}>Password</div>
                <div className={styles.input}>
                  <div className={styles.textWrapper}>
                    <input
                      type='password'
                      id='password'
                      name='password'
                      required
                      placeholder='Your password here'
                    />
                  </div>
                </div>
              </div>
              <br />
              <input type="submit" value="Login" className={styles.loginButton} />
            </form>
          </div>
          <div className={styles.textLinkWrapper}>
            <p className={styles.p}>
              <span className={styles.span}>Don&apos;t have an account? </span>
              <span className={styles.textWrapper2}>
                <Link href='/pages/create-account'>Create Account</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}