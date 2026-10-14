'use client';

import { useEffect } from 'react';
import { initializeGmb } from '@/gmb-site/interactions.js';

export function GmbContact() {
  useEffect(() => initializeGmb(), []);
  return null;
}
