import { revalidatePath } from "next/cache";
import * as asyncApi from "@/services/asyncapi";
import styles from "./page.module.css";

export default async function Init() {
  const initStatus = await asyncApi.getStatus();

  async function init() {
    "use server";
    await asyncApi.init();

    revalidatePath("/init");
  }

  return (
    <main className={styles.main}>
      <div>
        <div>Status: {initStatus}</div>

        <form action={init}>
          <button type="submit">Init AsyncAPI</button>
        </form>
      </div>
    </main>
  );
}
