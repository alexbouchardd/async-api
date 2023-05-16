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

export async function retrieveSourceByName(name: string) {
  const response = await fetchHookdeck(`/sources?name=${name}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error();

  const sourcesData = (await response.json()) as any;

  return (sourcesData?.models ?? [])?.[0] as Source | undefined;
}

export async function createSource(name: string) {
  const response = await fetchHookdeck("/sources", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  if (!response.ok) throw new Error();

  return response.json() as Promise<Source>;
}

type CreateDestinationPayload = Pick<Destination, "name" | "url">;

export async function createDestination(payload: CreateDestinationPayload) {
  const response = await fetchHookdeck("/destinations", {
    method: "POST",
    body: JSON.stringify({ name: payload.name, url: payload.url }),
  });

  if (!response.ok) throw new Error();

  return response.json() as Promise<Source>;
}

type CreateConnectionPayload = {
  name: string;
  source: {
    name: string;
  };
  destination: {
    name: string;
    url: string;
  };
  rules?: Rule[];
};

type CreateConnectionOptions = {
  upsert: boolean;
};

const DEFAULT_CREATE_CONNECTION_OPTIONS = { upsert: false };

export async function createConnection(
  payload: CreateConnectionPayload,
  options: CreateConnectionOptions = DEFAULT_CREATE_CONNECTION_OPTIONS
) {
  const response = await fetchHookdeck("/connections", {
    method: options.upsert ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error();

  return response.json() as Promise<Connection>;
}

export async function updateNotificationWebhook(payload: NotificationWebhook) {
  const response = await fetchHookdeck("/notifications/webhooks", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error();

  return response.json() as Promise<NotificationWebhook>;
}

// Types

type Source = {
  id: string;
  name: string;
};

type Destination = {
  id: string;
  name: string;
  url: string;
};

type Connection = {
  id: string;
  name: string;
  destination: Destination;
  source: Source;
};

type FilterRule = {
  type: "filter";
  body: object;
};

type Rule = FilterRule;

type WebhookType = "issue.opened" | "issue.updated" | "event.successful";

type NotificationWebhook = {
  enabled: boolean;
  topics: WebhookType[];
  source_id: string;
};
