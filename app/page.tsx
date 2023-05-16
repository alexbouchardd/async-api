import { useState } from "react";
import styles from "./page.module.css";
import Logs from "@/components/Logs";

export default function Home() {
  return (
    <main className={styles.main}>
      <section>
        <h1 className={styles.title}>Your APIs</h1>
        <p className={styles.subtitle}>
          Turn your slow or unreliable APIs unto an async API. Fire your request
          and listen for a webhook callback when the API call as succeeded.
        </p>
        <div className={styles.logLists}>
          <Logs />
        </div>
      </section>
      <section>Search</section>
    </main>
  );
}
