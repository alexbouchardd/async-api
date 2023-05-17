import styles from "./../page.module.css";
import {
  retrieveConnectionsForAPI,
  retrieveSourceByName,
  RetryRule,
} from "@/services/hookdeck";
import { NAME_PREFIX } from "@/util";

export default async function APIView({ params }: { params: { api: string } }) {
  const source = await retrieveSourceByName(`${NAME_PREFIX}${params.api}`);

  if (!source) {
    return <p>404</p>;
  }

  // const log = await asyncApi.getLog(source.id);

  const connections = await retrieveConnectionsForAPI(params.api);

  const input_connection = connections.find(
    (connection) => connection.name === params.api
  );
  const callback_connection = connections.find(
    (connection) => connection.source.name === `${NAME_PREFIX}callback`
  );

  const url = `htttp://${process.env.NEXT_PUBLIC_VERCEL_URL}/${
    source.name.split(NAME_PREFIX)[1]
  }/proxy`;

  return (
    <main className={styles.main}>
      <section>
        <div style={{ maxWidth: "540px", position: "fixed" }}>
          <h1 className={styles.title}>{source.name.split(NAME_PREFIX)[1]}</h1>
          <p className={styles.subtitle}>
            Configure your API to be async. Replace OpenAI API endpoint{" "}
            <strong>{input_connection?.destination.url}</strong> with{" "}
            <strong>{url}</strong>
          </p>
          {/* <div className={styles.logLists}>
            <Logs />
          </div> */}
        </div>
      </section>
      <section>
        <div className={styles.sourceCard}>
          <div>
            <span className={styles.sourceCardText}>Replacement API URL</span>
            <span className={styles.sourceCardUrl}>{url}</span>
          </div>
        </div>
        <div className={styles.sourceCard}>
          <div>
            <span className={styles.sourceCardText}>API URL</span>
            <span className={styles.sourceCardUrl}>
              {input_connection?.destination.url}
            </span>
          </div>
        </div>
        <div className={styles.sourceCard}>
          <div>
            <span className={styles.sourceCardText}>Callback URL</span>
            <span className={styles.sourceCardUrl}>
              {callback_connection?.destination.url}
            </span>
          </div>
        </div>
        <div className={styles.sourceCard}>
          <div>
            <span className={styles.sourceCardText}>Request Throttle</span>
            <span className={styles.sourceCardUrl}>
              {input_connection?.destination.rate_limit} /
              {input_connection?.destination.rate_limit_period}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
