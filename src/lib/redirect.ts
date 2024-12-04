import type { URL } from 'url';

/**
 * Handles redirection for legacy search routes.
 *
 * @param url - The URL object from the request.
 * @returns A Response object for redirection, or null if no redirect is needed.
 */
export function handleSearchRedirect(url: URL): Response | null {
  const query = url.searchParams.get('query') || url.searchParams.get('q');

  if (query) {
    console.info(`Query Parameter: ${query}`);
    console.info(`Redirecting to: /${encodeURIComponent(query)}`);
    // Redirect to the new format: /query/<query>
    return new Response(null, {
      status: 301, // Permanent redirect
      headers: {
        Location: `/${encodeURIComponent(query)}`
      }
    });
  }

  // Redirect to the homepage if no query is provided
  return new Response(null, {
    status: 301,
    headers: {
      Location: '/'
    }
  });
}
