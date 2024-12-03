import type { RequestHandler } from '@sveltejs/kit';

const pages: string[] = ['']; // populate this with all the slugs you wish to include

export const GET: RequestHandler = ({ request }) => {
  const site: string = request.headers.get('Host') ?? 'http://localhost:5173';
  const body: string = sitemap(site, pages);
  const response = new Response(body);
  response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
  response.headers.set('Content-Type', 'application/xml');
  return response;
};

const sitemap = (site: string, pages: string[]) => {
  // Ensure the site includes the protocol (http/https)
  const sanitizedSite =
    site.startsWith('http://') || site.startsWith('https://') ? site : `https://${site}`;

  return `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${sanitizedSite}/${encodeURIComponent(page)}</loc>
    <priority>1.0</priority>
  </url>
  `
    )
    .join('')}
</urlset>`;
};
