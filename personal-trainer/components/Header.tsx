"use client";

import React, { useEffect, useState } from "react";
import styles from "@/components/Dashboard.module.css";

const Header: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await fetch("/api/user/get", {
        headers: {
          "x-user-id": userId,
        },
      });

      const data = await res.json();
      if (data.success) {
        setUsername(data.user);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1>Cross-Platform Personal Trainer Dashboard</h1>
      </div>
      <div className={styles.headerRight}>
        {username && `${username}`}
      </div>
    </header>
  );
};

export default Header;