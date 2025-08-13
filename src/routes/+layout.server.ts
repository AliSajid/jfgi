// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import type { LayoutServerLoad } from './$types';
import { getVisitors } from '$lib/services';

export const load: LayoutServerLoad = async () => {
  const visitorCount = await getVisitors();
  const siteName = 'Just Fucking Google It!';

  return {
    count: visitorCount,
    siteName
  };
};
