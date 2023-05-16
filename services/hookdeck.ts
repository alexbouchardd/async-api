function fetchHookdeck(path: string, init: RequestInit = {}) {
  return fetch(`${process.env.HOOKDECK_API_URL}/2023-01-01${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HOOKDECK_API_KEY}`,
    },
  });
}

export async function retrieveSources() {
  const response = await fetchHookdeck("/sources", {
    method: "GET",
  });

  if (!response.ok) throw new Error();

  const sourcesData = (await response.json()) as any;

  return (sourcesData?.models ?? []) as Source[];
}

// Types

type Source = {
  id: string;
  name: string;
};
