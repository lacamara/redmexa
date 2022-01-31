import { useEffect, useState } from "react";
import useSWR from "swr";

const pinger = async (url) => {
  try {
    const res = await fetch(url, { method: "HEAD", credentials: "omit" });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const useIsOffline = () => {
  const { data: isOnline, isValidating } = useSWR("/api/ping/", pinger, {
    refreshInterval: 10000,
    dedupingInterval: 10000,
    focusThrottleInterval: 10000,
    refreshWhenOffline: true,
    shouldRetryOnError: false,
    revalidateIfStale: false,
  });

  const [isUnloading, setIsUnloading] = useState(false);
  useEffect(() => {
    let handleBeforeUnload = () => setIsUnloading(true);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  return !isUnloading && typeof isOnline === "boolean" ? !isOnline : null;
};
