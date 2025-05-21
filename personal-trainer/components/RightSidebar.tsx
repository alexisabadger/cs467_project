import styles from '@/components/Dashboard.module.css';

export default function RightSidebar() {
    return (
      <aside className={`${styles.card} ${styles.rightSidebar}`}>
        <h2>Fitness Plan Tracker</h2>
        <ul>
          <li>Line 1</li>
          <li>Line 2</li>
          <li>Line 3</li>
        </ul>
      </aside>
    );
  }
