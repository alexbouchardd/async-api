import * as hookdeck from "./hookdeck";

const NAME_PREFIX = `async-api`;

const CALLBACK_SOURCE_NAME = `${NAME_PREFIX}-callback`;

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
 * - create new callback destination with filter
 */
export async function createApi(payload: CreateApiPayload) {
  const names = createConnectionNames(payload.name);

  await hookdeck.createConnection({
    name: names.connection,
    source: { name: names.source },
    destination: { name: names.destination, url: payload.apiUrl },
  });

  await hookdeck.createConnection({
    name: names.callbackConnection,
    source: { name: CALLBACK_SOURCE_NAME },
    destination: { name: names.callbackDestination, url: payload.callbackUrl },
    rules: [
      {
        type: "filter",
        body: { connection: { source: { name: names.source } } },
      },
    ],
  });
}

// ===== Helpers =====

function createConnectionNames(name: string) {
  return {
    source: `${NAME_PREFIX}-${name}`,
    connection: name,
    destination: name,
    callbackConnection: `${name}-callback`,
    callbackDestination: `${name}-callback`,
  };
}