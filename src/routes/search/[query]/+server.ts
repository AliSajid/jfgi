import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
  // Check if the pathname is in the correct format

  if (url.pathname.startsWith('/search/')) {
    const query = url.pathname.slice(8);

    return new Response(null, {
      status: 301, // Permanent redirect
      headers: {
        Location: `/${encodeURIComponent(query)}`
      }
    });
  }

  // Fallback if needed (unlikely to be reached)
  return new Response('No redirect applied', { status: 404 });
};
