"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

const temp_logs = [
  {
    id: 1,
    url: "GET https://api.openai.com/v1/completions",
  },
  {
    id: 2,
    url: "GET https://api.openai.com/v1/completions",
  },
  {
    id: 3,
    url: "GET https://api.openai.com/v1/completions",
  },
  {
    id: 4,
    url: "GET https://api.openai.com/v1/completions",
  },
  {
    id: 5,
    url: "GET https://api.openai.com/v1/completions",
  },
  {
    id: 6,
    url: "GET https://api.openai.com/v1/completions",
  },
  {
    id: 7,
    url: "GET https://api.openai.com/v1/completions",
  },
  {
    id: 8,
    url: "GET https://api.openai.com/v1/completions",
  },
];

const Logs: React.FC = () => {
  const [logs, setLogs] = useState([...temp_logs]);

  setTimeout(() => {
    setLogs([
      ...logs.slice(-8),
      {
        id: logs[logs.length - 1].id + 1,
        url: "GET https://api.openai.com/v1/completions",
      },
    ]);
  }, 1000);

  return (
    <ul>
      <LayoutGroup>
        {logs.map((log, i) => (
          <motion.li
            key={log.id}
            layout
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 120,
              //delay: (8 - i) * 0.01,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1 - (Math.abs(i - 5) * 2.8) / 10,
            }}
          >
            {log.url}
          </motion.li>
        ))}
      </LayoutGroup>
    </ul>
  );
};

export default Logs;
