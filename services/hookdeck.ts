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

export async function retrieveConnectionsForAPI(name: string) {
  const url =
    "/connections?" +
    new URLSearchParams({
      name,
      limit: "2",
    }).toString();

  const response = await fetchHookdeck(url, {
    method: "GET",
  });

  if (!response.ok) throw new Error();

  const data = (await response.json()) as any;

  return (data?.models ?? null) as Connection[];
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
  const response = await fetchHookdeck(`/sources?name=${name}&limit=1`, {
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

export async function retrieveEventList(source_id: string) {
  const url =
    "/events?" +
    new URLSearchParams({
      source_id,
      include: "data",
      limit: "10",
    }).toString();

  const response = await fetchHookdeck(url, {
    method: "GET",
  });

  if (!response.ok) throw new Error();

  const eventsData = (await response.json()) as any;

  return (eventsData?.models ?? []) as Event[];
}

// Types
interface Source {
  id: string;
  team_id: string;
  name: string;
  url: string;
  archived_at?: string;
  updated_at: string;
  created_at: string;
}

interface ShortEventData {
  path: string;
  query: string;
  parsed_query: { [k: string]: any };
  headers: Record<string, string>;
  body: string | { [k: string]: any };
  is_large_payload?: boolean;
}

type EventStatus = "SCHEDULED" | "QUEUED" | "HOLD" | "SUCCESSFUL" | "FAILED";

interface Event {
  id: string;
  team_id: string;
  webhook_id: string;
  source_id: string;
  destination_id: string;
  event_data_id: string;
  request_id: string;
  attempts: number;
  data?: ShortEventData | null;
  last_attempt_at: string;
  next_attempt_at: string;
  response_status: number;
  status: EventStatus;
  successful_at: string;
  cli_id: string;
  updated_at: string;
  created_at: string;
}

interface Event {
  id: string;
  team_id: string;
  webhook_id: string;
  source_id: string;
  destination_id: string;
  event_data_id: string;
  request_id: string;
  attempts: number;
  data?: ShortEventData | null;
  last_attempt_at: string;
  next_attempt_at: string;
  response_status: number;
  status: EventStatus;
  successful_at: string;
  cli_id: string;
  updated_at: string;
  created_at: string;
}

type DestinationRateLimitPeriod = "second" | "minute" | "hour";

interface Destination {
  id: string;
  team_id: string;
  name: string;
  path_forwarding_disabled?: boolean;
  url?: string;
  cli_path?: string;
  rate_limit?: number;
  rate_limit_period?: DestinationRateLimitPeriod;
  archived_at?: string;
  updated_at: string;
  created_at: string;
}

type ConnectionFilterProperty = string | number | boolean | "null" | object;
type RetryStrategy = "linear" | "exponential";
type RetryRule = {
  type: "retry";
  strategy: RetryStrategy;
  interval: number;
  count: number;
};
type FilterRule = {
  type: "filter";
  headers?: ConnectionFilterProperty;
  body?: ConnectionFilterProperty;
  query?: ConnectionFilterProperty;
  path?: ConnectionFilterProperty;
};

type Rule = RetryRule | FilterRule;

interface Connection {
  id: string;
  name: string;
  team_id: string;
  destination: Destination;
  source: Source;
  resolved_rules: Rule[];
  rules?: Rule[];
  archived_at: string;
  paused_at: string;
  updated_at: string;
  created_at: string;
}

type WebhookType = "issue.opened" | "issue.updated" | "event.successful";

type NotificationWebhook = {
  enabled: boolean;
  topics: WebhookType[];
  source_id: string;
};
