import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const hostname = event.request.headers.get('Host') ?? 'http://localhost:5173';

  event.locals.hostname = hostname;
  event.locals.isLocalhost = hostname?.toLowerCase().includes('local');
  event.locals.isExplicit =
    hostname?.toLowerCase().includes('fucking') || hostname?.toLowerCase().includes('localtest');

  return await resolve(event);
};
