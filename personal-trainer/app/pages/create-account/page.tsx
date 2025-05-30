'use client';
import React from "react";
import styles from './create.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateAccount() {
  const router = useRouter();

  const userSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const firstName = (document.getElementById('first-name') as HTMLInputElement).value;
    const lastName = (document.getElementById('last-name') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)
      .value;

    if (password === confirmPassword) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName, lastName, password }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        router.push('/');
      } else {
        alert('Create account failed: ' + data.error);
      }
    }
    else {
      alert("Password and confirm password do not match.");
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
            <form onSubmit={userSave}>
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