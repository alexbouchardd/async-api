"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((x) => x + 1)}>
      Client-Only Counter: {count}
    </button>
  );
}
