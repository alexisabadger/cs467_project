"use client";

import styles from "@/components/Dashboard.module.css";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import MainContent from "@/components/MainContent";
import RightSidebar from "@/components/RightSidebar";

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.contentGrid}>
        <div className={`${styles.card} ${styles.leftSidebar}`}>
          <LeftSidebar />
        </div>
        <div className={`${styles.card} ${styles.mainContent}`}>
          <MainContent />
        </div>
        <div className={`${styles.card} ${styles.rightSidebar}`}>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}