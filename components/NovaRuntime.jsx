'use client';

import { useEffect } from 'react';
import { initNova } from '../lib/nova';

// Starts the loader, GSAP motion and interactions on the server-rendered markup.
export default function NovaRuntime() {
  useEffect(() => { initNova(); }, []);
  return null;
}
