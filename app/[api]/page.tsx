import styles from "./page.module.css";
import {
  retrieveConnectionsForAPI,
  retrieveSourceByName,
  retrieveEventList,
} from "@/services/hookdeck";

export default async function APIView({ params }: { params: { api: string } }) {
  const source = await retrieveSourceByName(`async-api-${params.api}`);

  if (!source) {
    return <p>404</p>;
  }

  const connections = await retrieveConnectionsForAPI(params.api);

  const events = await retrieveEventList(source.id);

  const input_connection = connections.find(
    (connection) => connection.name === params.api
  );
  const callback_connection = connections.find(
    (connection) => connection.source.name === `async-api-callback`
  );

  const retry_rule = input_connection?.resolved_rules.find(
    (rule) => rule.type === "retry"
  );

  return (
    <main className={styles.main}>
      <h1>{source.name}</h1>
      <h2>Configs</h2>
      <h3>API Replacement URL</h3>
      <p>{source.url}</p>
      <h3>Callback URL</h3>
      <p>{callback_connection?.destination.url}</p>
      <h3>Retry</h3>
      <p>
        {retry_rule?.strategy} {retry_rule?.interval}
      </p>
      <h3>Throttle</h3>
      <p>
        {input_connection?.destination.rate_limit} /
        {input_connection?.destination.rate_limit_period}
      </p>

      <h2>Logs</h2>
      {events.map((event) => (
        <p key={event.id}>{event.id}</p>
      ))}
    </main>
  );
}
