import styles from "./page.module.css";
import { Counter } from "@/components/counter";
import { retrieveSources } from "@/services/hookdeck";

export default async function New() {
  const sources = await retrieveSources();

  async function add(data: FormData) {
    "use server";

    const name = data.get("name");
    const apiUrl = data.get("apiUrl");
    const callbackUrl = data.get("callbackUrl");

    console.log({ name, apiUrl, callbackUrl });
  }

  return (
    <main className={styles.main}>
      {sources.map((source) => {
        return <div key={source.id}>{source.name}</div>;
      })}

      <form className={styles.form} action={add}>
        <label className={styles.label}>
          <span>Name</span>
          <input name="name" />
        </label>

        <label className={styles.label}>
          <span>API URL</span>
          <input name="apiUrl" />
        </label>

        <label className={styles.label}>
          <span>Callback URL</span>
          <input name="callbackUrl" />
        </label>

        <button type="submit">Add</button>
      </form>

      <Counter />
    </main>
  );
}
