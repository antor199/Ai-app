import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '',
  persistSession: true,
  global: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { ...init, credentials: 'include' })
  }
});