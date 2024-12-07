import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
// SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import type { Handle } from '@sveltejs/kit';

Sentry.init({
  dsn: 'https://1c69e7ab8a552f0cbfb0299dd4132fe0@o4504249287639040.ingest.us.sentry.io/4508423871463424',
  tracesSampleRate: 1
});

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
  const hostname = event.request.headers.get('Host') ?? 'http://localhost:5173';

  event.locals.hostname = hostname;
  event.locals.isLocalhost = hostname?.toLowerCase().includes('local');
  event.locals.isExplicit =
    hostname?.toLowerCase().includes('fucking') || hostname?.toLowerCase().includes('localtest');

  return await resolve(event);
});
export const handleError = Sentry.handleErrorWithSentry();
