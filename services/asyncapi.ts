import * as hookdeck from "./hookdeck";
import * as proxy from "./proxy";

export const NAME_PREFIX = `async-api-`;

const CALLBACK_SOURCE_NAME = `${NAME_PREFIX}callback`;

export async function getStatus() {
  const callbackSource = await hookdeck.retrieveSourceByName(
    CALLBACK_SOURCE_NAME
  );
  const isInitialized = !!callbackSource;
  return isInitialized ? "initialized" : "uninitialized";
}

/**
 * Setup Hookdeck Workspace Config
 * - create source ___callback___
 * - turn on events.successful callback
 */
export async function init() {
  const callbackSource = await hookdeck.createSource(CALLBACK_SOURCE_NAME);
  await hookdeck.updateNotificationWebhook({
    enabled: true,
    topics: ["event.successful"],
    source_id: callbackSource.id,
  });
}

type CreateApiPayload = {
  name: string;
  apiUrl: string;
  callbackUrl: string;
};

/**
 * Create new async API
 * - create new connection to API
 * - create new callback destination with filter and transformation
 */
export async function createApi(payload: CreateApiPayload) {
  const names = composeConnectionNames(payload.name);

  const [apiConnection] = await Promise.all([
    hookdeck.createConnection({
      name: names.connection,
      source: { name: names.source },
      destination: { name: names.destination, url: payload.apiUrl },
    }),

    await hookdeck.createConnection({
      name: names.callbackConnection,
      source: { name: CALLBACK_SOURCE_NAME },
      destination: {
        name: names.callbackDestination,
        url: payload.callbackUrl,
      },
      rules: [
        {
          type: "filter",
          headers: { "x-async-api-source-name": names.source },
        },
        {
          type: "transform",
          transformation: {
            name: `${NAME_PREFIX}transform-callback`,
            code: `addHandler('transform', (req) => { req.headers['x-async-api-source-name'] = req.body.connection.source.name; req.body = req.body.attempt_response; return req; })`,
          },
        },
      ],
    }),
  ]);

  await proxy.cacheApi(payload.name, apiConnection.source.url);
}

export async function getLog(api: string, sourceId: string) {
  const events = await hookdeck.retrieveEventList(sourceId);
  const destinationsSet = new Set<string>();
  events.forEach((event) => {
    destinationsSet.add(event.destination_id);
  });
  const destinations = await hookdeck.retrieveDestinationList(
    Array.from(destinationsSet)
  );
  const destinationsMap = destinations.reduce((map, destination) => {
    map.set(destination.id, destination);
    return map;
  }, new Map<string, hookdeck.Destination>());

  return events
    .map((event) => {
      const destination = destinationsMap.get(event.destination_id);
      if (!destination) return null;
      if (!event.data) return null;
      return composeLogLine({ api, event, destination });
    })
    .filter(Boolean) as LogLine[];
}

// ===== Helpers =====

function composeConnectionNames(name: string) {
  return {
    source: `${NAME_PREFIX}${name}`,
    connection: name,
    destination: name,
    callbackConnection: `${name}-callback`,
    callbackDestination: `${name}-callback`,
  };
}

export type LogLine = { id: string; api: string; url: string };

function composeLogLine({
  api,
  event,
  destination,
}: {
  api: string;
  event: hookdeck.Event;
  destination: hookdeck.Destination;
}): LogLine {
  const url = new URL(destination.url as string);
  url.pathname = (url.pathname === "/" ? "" : url.pathname) + event.data?.path;
  const searchParams = new URLSearchParams(url.search);
  Object.entries(event.data?.parsed_query ?? {}).forEach(([key, value]) => {
    searchParams.set(key, value);
  });
  url.search = searchParams.toString();

  return {
    id: event.id,
    api,
    url: url.toString(),
  };
}
