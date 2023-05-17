"use client";
import styles from "./page.module.css";
import { Connection } from "@/services/hookdeck";
import Logs from "@/components/Logs";
import Image from "next/image";
import { useState } from "react";
import { createApiFromForm } from "@/services/asyncapi";
import APIS_DIRECTORY from "../apis-directory";

const HomeScreen: React.FC<{ connections: Connection[] }> = ({
  connections,
}) => {
  const [show_create, setShowCreate] = useState(false);
  const [api, setApi] = useState<
    | {
        name: string;
        logo: string;
        api_url: string;
      }
    | null
    | undefined
  >(undefined);

  if (!show_create && api !== undefined) {
    setApi(undefined);
  }
  return (
    <main className={styles.main}>
      <section>
        <div style={{ maxWidth: "540px", position: "fixed" }}>
          <h1 className={styles.title}>
            {show_create ? "Create New API" : "Your Async APIs"}
          </h1>
          <p className={styles.subtitle}>
            {show_create
              ? "Create a new Async API to turn any API request into a webhook callback"
              : "Turn your slow or unreliable APIs unto an async API. Fire your request and listen for a webhook callback when the API call as succeeded."}
          </p>
          {!show_create ? (
            <div className={styles.callout}>
              <span>Explore a guided walkthough of AsyncAPI</span>
              <Image
                src="/arrow-icon-green.svg"
                alt="AsyncAPI Logo"
                width={20}
                height={20}
                priority
              />
            </div>
          ) : (
            <button
              className={styles.buttonSecondary}
              onClick={() => setShowCreate(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_12_5735)">
                  <path
                    d="M15.8337 5.3415L14.6587 4.1665L10.0003 8.82484L5.34199 4.1665L4.16699 5.3415L8.82533 9.99984L4.16699 14.6582L5.34199 15.8332L10.0003 11.1748L14.6587 15.8332L15.8337 14.6582L11.1753 9.99984L15.8337 5.3415Z"
                    fill="#666666"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_12_5735">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Cancel
            </button>
          )}
          {!show_create && (
            <div className={styles.logLists}>
              <Logs />
            </div>
          )}
        </div>
      </section>
      <section>
        <>
          {!show_create && (
            <div style={{ display: "flex" }}>
              <div style={{ position: "relative", flexGrow: 1 }}>
                <input
                  className={styles.search}
                  placeholder="Search for an API"
                />
                <svg
                  style={{ position: "absolute", top: "16px", left: "20px" }}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_12_3088)">
                    <path
                      d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                      fill="#666666"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_12_3088">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <button
                className={styles.button}
                onClick={() => setShowCreate(true)}
                disabled={show_create && api === undefined}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_12_3093)">
                    <path
                      d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                      fill="#FCFFFE"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_12_3093">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {show_create ? "Confirm" : "Create new API"}
              </button>
            </div>
          )}
          {show_create && (
            <>
              {api === undefined ? (
                <>
                  <h2>Choose an API</h2>
                  {Object.values(APIS_DIRECTORY).map((config) => (
                    <button
                      key={config.name}
                      className={styles.sourceCard}
                      onClick={() => setApi(config)}
                    >
                      <div>
                        <div className={styles.sourceCardIcon}>
                          <Image
                            width={20}
                            height={20}
                            src={config.logo}
                            alt=""
                          />
                        </div>
                      </div>
                      <div>
                        <span className={styles.sourceCardText}>
                          {config.name}
                        </span>
                        <span className={styles.sourceCardUrl}>
                          {config.api_url}
                        </span>
                      </div>
                    </button>
                  ))}
                  <button
                    className={styles.sourceCard}
                    onClick={() => setApi(null)}
                  >
                    <div>
                      <div className={styles.sourceCardIcon}>
                        <Image
                          width={20}
                          height={20}
                          src={"/api-icon.svg"}
                          alt=""
                        />
                      </div>
                    </div>
                    <div>
                      <span className={styles.sourceCardText}>Custom API</span>
                      <span className={styles.sourceCardUrl}>
                        Provide a custom URL
                      </span>
                    </div>
                  </button>
                </>
              ) : (
                <form className={styles.form} action={createApiFromForm}>
                  <br />
                  <br />
                  <h2>{api?.name || "Custom API"}</h2>

                  <div
                    className={styles.sourceCard}
                    style={{ display: api ? "none" : "block" }}
                  >
                    <label className={styles.label}>
                      <span>Name</span>
                      <span>Set the name of your API</span>
                      {api ? (
                        <input name="name" value={api.name} />
                      ) : (
                        <input name="name" />
                      )}
                    </label>
                  </div>
                  <div
                    className={styles.sourceCard}
                    style={{ display: api ? "none" : "block" }}
                  >
                    <label className={styles.label}>
                      <span>API URL</span>
                      <span>
                        Replace with the root URL of the API you are using (e.g.
                        https://api.openai.com/v1/)
                      </span>
                      {api ? (
                        <input name="apiUrl" value={api.api_url} />
                      ) : (
                        <input name="apiUrl" />
                      )}
                    </label>
                  </div>

                  <div className={styles.sourceCard}>
                    <label className={styles.label}>
                      <span>Callback URL</span>
                      <span>
                        The URL where you would want to receive the webhooks
                        callback when the API responds successfully
                      </span>
                      <input name="callbackUrl" />
                    </label>
                  </div>

                  <div className={styles.sourceCard}>
                    <label className={styles.label}>
                      <span>Request Throttle</span>
                      <span>
                        Optional: Respect the rate limit of the API you are
                        using.
                      </span>
                      <input name="rateLimit" type="number" />
                    </label>
                  </div>

                  <br />
                  <button
                    className={styles.button}
                    type="submit"
                    disabled={show_create && api === undefined}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_12_3093)">
                        <path
                          d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                          fill="#FCFFFE"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_12_3093">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Create
                  </button>
                </form>
              )}
            </>
          )}
          {!show_create &&
            connections.map((connection) => (
              <a
                key={connection.id}
                className={styles.sourceCard}
                href={`/${connection.name}`}
              >
                <div>
                  <div className={styles.sourceCardIcon}>
                    <Image width={20} height={20} src="/openai.svg" alt="" />
                  </div>
                </div>
                <div>
                  <span className={styles.sourceCardText}>
                    {connection.name}
                  </span>
                  <span className={styles.sourceCardUrl}>
                    {connection.destination.url}
                  </span>
                </div>
              </a>
            ))}
        </>
      </section>
    </main>
  );
};

export default HomeScreen;
