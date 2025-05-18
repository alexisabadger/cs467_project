'use client';
import React from "react";
import styles from './create.module.css';
import Link from 'next/link';

export default function CreateAccount() {
 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const firstName = (form['first-name'] as HTMLInputElement).value.trim();
  const lastName = (form['last-name'] as HTMLInputElement).value.trim();
  const email = (form['email'] as HTMLInputElement).value.trim();
  const password = (form['password'] as HTMLInputElement).value;
  const confirmPassword = (form['confirm-password'] as HTMLInputElement).value;

  // Password match check
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch('/api/create-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
    });

    const data = await res.json();

    if (data.success) {
      alert('Account created! Redirecting to login...');
      window.location.href = '/'; // Or use Next router
    } else {
      alert('Error: ' + (data.error || data.message));
    }
  } catch (error) {
    console.error('Submission failed:', error);
    alert('Something went wrong. Please try again.');
  }
};


  return (
    <div className={styles.gridContainer}>
      <div className={styles.title}>
        Cross-Platform Personal Trainer Webapp
      </div>

      <div className={styles.bodyGrid}>
        <div className={styles.loginHeader}>Create Account</div>
        <div className={styles.body}>
          <div className={styles.FormLogIn}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputField}>
                <div className={styles.label}>First Name</div>
                <div className={styles.input}>
                  <div className={styles.textWrapper}>
                    <input
                      type='text'
                      id='first-name'
                      name='first-name'
                      required
                      placeholder='First Name'
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className={styles.inputField}>
                <div className={styles.label}>Last Name</div>
                <div className={styles.input}>
                  <div className={styles.textWrapper}>
                    <input
                      type='text'
                      id='last-name'
                      name='last-name'
                      required
                      placeholder='Last Name'
                    />
                  </div>
                </div>
              </div>
              <br />
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
                      placeholder='Password here'
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className={styles.inputField}>
                <div className={styles.label}>Confirm Password</div>
                <div className={styles.input}>
                  <div className={styles.textWrapper}>
                    <input
                      type='password'
                      id='confirm-password'
                      name='confirm-password'
                      required
                      placeholder='Confirm password'
                    />
                  </div>
                </div>
              </div>
              <br />
              <input type="submit" value="Create Account" className={styles.loginButton} />
            </form>
          </div>
          <div className={styles.textLinkWrapper}>
            <p className={styles.p}>
              <span className={styles.span}>Already have an account? </span>
              <span className={styles.textWrapper2}>
                <Link href='/'>Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}