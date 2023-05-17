"use client";

import useInterval from "@/hooks/useInterval";
import { LogLine } from "@/services/asyncapi";
import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";

const Logs: React.FC = () => {
  const [logLines, setLogs] = useState<LogLine[]>([]);
  const [shown_start_index, setShownStartIndex] = useState<number>(0);

  useEffect(() => {
    fetch("/api/lines")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logLines.reverse());
      });
  }, []);

  useInterval(() => {
    fetch(`/api/lines?prev=${logLines[logLines.length - 1]?.id}`)
      .then((res) => res.json())
      .then((data) => {
        setLogs([...logLines, ...data.logLines.reverse()]);
      });
  }, 3000);

  useInterval(() => {
    setShownStartIndex((shown_start_index) =>
      shown_start_index < logLines.length
        ? shown_start_index + 1
        : shown_start_index
    );
  }, 1000);

  return (
    <ul>
      <LayoutGroup>
        {logLines
          .filter((_, i) => i <= shown_start_index && i > shown_start_index - 9)
          .map((log, i) => (
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
                opacity: 1 - (Math.abs(i - 4) * 2.2) / 10,
              }}
            >
              {log.method} {log.url}
            </motion.li>
          ))}
      </LayoutGroup>
    </ul>
  );
};

export default Logs;
