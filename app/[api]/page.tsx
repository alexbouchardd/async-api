import { NAME_PREFIX } from "@/services/asyncapi";
import styles from "./page.module.css";
import {
  retrieveConnectionsForAPI,
  retrieveSourceByName,
  RetryRule,
} from "@/services/hookdeck";
import * as asyncApi from "@/services/asyncapi";

export default async function APIView({ params }: { params: { api: string } }) {
  const source = await retrieveSourceByName(`${NAME_PREFIX}${params.api}`);

  if (!source) {
    return <p>404</p>;
  }

  const log = await asyncApi.getLog(params.api, source.id);

  const connections = await retrieveConnectionsForAPI(params.api);

  const input_connection = connections.find(
    (connection) => connection.name === params.api
  );
  const callback_connection = connections.find(
    (connection) => connection.source.name === `${NAME_PREFIX}callback`
  );

  const retry_rule = input_connection?.resolved_rules.find(
    (rule) => rule.type === "retry"
  ) as RetryRule;

  return (
    <main className={styles.main}>
      <h1>{source.name.split(NAME_PREFIX)[0]}</h1>
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
      {log.map((logLine) => (
        <p key={logLine.id}>{logLine.url}</p>
      ))}
    </main>
  );
}
