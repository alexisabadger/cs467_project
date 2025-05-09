import React from "react";
import styles from './create.module.css';
import Link from 'next/link';

export default function CreateAccount() {
  return (

    
    <div className={styles.desktop}>
    <div className={styles.div}>
      <div className={styles.overlapGroup}>
        <div className={styles.FormLogIn}>
        <form>
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
                    type='text'
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
                    type='text'
                    id='confirm-password'
                    name='confirm-password'
                    required
                    placeholder='Confirm password'
                  />
                </div>
              </div>
            </div>
            <br />
            <input type="submit" value="Create Login" className={styles.loginButton} />
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
      
      <div className={styles.overlap}>
      </div>
      <div className={styles.textWrapper4}>Create Account</div>
    </div>
  </div>
);
}
    