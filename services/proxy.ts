import { kv } from "@vercel/kv";

export async function cacheApi(name: string, url: string) {
  await kv.set(`proxy:${name}`, url);
}

export async function getApi(name: string) {
  return kv.get(`proxy:${name}`) as Promise<string>;
}
