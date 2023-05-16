import { revalidatePath } from "next/cache";
import { Counter } from "@/components/counter";
import * as hookdeck from "@/services/hookdeck";
import * as asyncApi from "@/services/asyncapi";
import styles from "./page.module.css";

export default async function New() {
  const sources = await hookdeck.retrieveSources();

  async function createApi(data: FormData) {
    "use server";

    const name = data.get("name") as string;
    const apiUrl = data.get("apiUrl") as string;
    const callbackUrl = data.get("callbackUrl") as string;

    await asyncApi.createApi({ name, apiUrl, callbackUrl });

    revalidatePath("/new");
  }

  return (
    <main className={styles.main}>
      <div>
        {sources.map((source) => {
          return <div key={source.id}>{source.name}</div>;
        })}
      </div>

      <form className={styles.form} action={createApi}>
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
