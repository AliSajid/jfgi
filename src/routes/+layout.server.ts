import type { LayoutServerLoad } from './$types';
import getVisitors from '$lib/server/counter';

export const load: LayoutServerLoad = async ({ locals }) => {
  const visitorCount = await getVisitors();
  const isExplicit = locals.isExplicit;
  const siteName = isExplicit ? 'Just Fucking Google It!' : 'Just Google It!';

  return {
    count: {
      count: visitorCount
    },
    isExplicit: isExplicit,
    siteName: siteName
  };
};
