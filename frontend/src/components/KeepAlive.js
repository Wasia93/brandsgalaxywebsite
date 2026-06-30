'use client';
import { useEffect } from 'react';

const PING_URL = '/api/ping';
const INTERVAL_MS = 8 * 60 * 1000; // ping every 8 minutes (Render sleeps after 15)

export default function KeepAlive() {
  useEffect(() => {
    const ping = () => fetch(PING_URL, { method: 'GET', cache: 'no-store' }).catch(() => {});
    ping(); // wake immediately on page load
    const id = setInterval(ping, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return null;
}
