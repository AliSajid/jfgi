// SPDX-FileCopyrightText: 2022 - 2024 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import type { RequestHandler } from '@sveltejs/kit';
import { handleSearchRedirect } from '$lib/redirect';

export const GET: RequestHandler = ({ url }) => {
  const response = handleSearchRedirect(url);

  if (response) {
    return response;
  }

  // Fallback if needed (unlikely to be reached)
  return new Response('No redirect applied', { status: 404 });
};
