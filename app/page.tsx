import styles from "./page.module.css";
import { retrieveSources } from "@/services/hookdeck";
import Logs from "@/components/Logs";
import * as asyncApi from "@/services/asyncapi";
import { NAME_PREFIX } from "@/services/asyncapi";

export default async function Home() {
  const sources = await retrieveSources();
  const log = await asyncApi.getAllLog();

  return (
    <main className={styles.main}>
      <section>
        <h1 className={styles.title}>Your APIs</h1>
        <p className={styles.subtitle}>
          Turn your slow or unreliable APIs unto an async API. Fire your request
          and listen for a webhook callback when the API call as succeeded.
        </p>

        <div>
          {log.map((logLine) => (
            <p key={logLine.id}>
              {logLine.method} {logLine.url}
            </p>
          ))}
        </div>

        <div className={styles.logLists}>
          <Logs />
        </div>
      </section>

      <section>
        Search<button>Create</button>
        {sources.map((source) => (
          <a
            key={source.id}
            className={styles.sourceCard}
            href={`/${source.name.split(NAME_PREFIX)[1]}`}
          >
            {source.name.split(NAME_PREFIX)[1]}
          </a>
        ))}
      </section>
    </main>
  );
}
