"use client";
import React from "react";
import Link from "next/link";
import styles from './login.module.css'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    // Form submission logic here

    router.push("/pages/dashboard");
  };

  return (
    <html>
  <body>
    <div className={styles.desktop}>
      <div className={styles.div}>
        <div className={styles.overlapGroup}>
          <div className={styles.FormLogIn}>
            <form action="/pages/dashboard" method="post"> 
              <div className={styles.inputField}>
                <div className={styles.label}>Email</div>
                <div className={styles.input}>
                  <div className={styles.textWrapper}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Your email here"
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
                      type="text"
                      id="password"
                      name="password"
                      required
                      placeholder="Your password here"
                    />
                  </div>
                </div>
              </div>
              <br />
              <button type="submit" className={styles.button}>Login</button>
              </form>
          </div>
          <div className={styles.textLinkWrapper}>
            <p className={styles.p}>
              <span className={styles.span}>Don’t have an account? </span>
              <span className={styles.textWrapper2}>
                <a href="/pages/createAccount"> Create Account </a>
              </span>
            </p>
          </div>
        </div>
        <div className={styles.overlap}>
          <div className={styles.textWrapper3}>
            Cross-Platform Personal Trainer Webapp
          </div>
        </div>
        <div className={styles.textWrapper4}>Log in</div>
      </div>
    </div>
  </body>
</html>
  );
}
