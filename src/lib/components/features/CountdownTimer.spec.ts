import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { setupDeterministicRaf } from '../../utils/raf';

// Force browser environment for the component's runtime checks
vi.mock('$app/environment', () => ({ browser: true }));

import CountdownTimer from './CountdownTimer.svelte';

// Helper to read CSS var from inline style
function getCssVar(el: Element | null, name = '--value') {
  if (!el) return NaN;
  const v = (el as HTMLElement).style.getPropertyValue(name);
  return v ? parseFloat(v) : NaN;
}

describe('CountdownTimer', () => {
  let raf: ReturnType<typeof setupDeterministicRaf>;

  beforeEach(() => {
    raf = setupDeterministicRaf();
  });

  afterEach(() => {
    raf.restore();
  });

  it('renders with default props', async () => {
    const { container } = render(CountdownTimer);
    await raf.flushOne();

    expect(container.querySelector('.radial-progress')).not.toBeNull();
    expect(container.querySelector('.countdown')).not.toBeNull();
  });

  it('accepts custom timer prop', async () => {
    const { container } = render(CountdownTimer, { props: { timer: 20 } });
    await raf.flushOne();

    const el = container.querySelector('.countdown span');
    expect(el).not.toBeNull();
    expect(getCssVar(el)).toBe(20);
  });

  it('updates countdown every second', async () => {
    const { container } = render(CountdownTimer, { props: { timer: 5 } });
    await raf.flushOne(); // t=0

    const el = container.querySelector('.countdown span');
    expect(getCssVar(el)).toBe(5);

    await raf.advance(1000); // +1s

    expect(getCssVar(el)).toBe(4);
  });

  it('updates progress correctly', async () => {
    const { container } = render(CountdownTimer, { props: { timer: 10 } });
    await raf.flushOne(); // t=0

    const progressEl = container.querySelector('.radial-progress');
    expect(getCssVar(progressEl)).toBeCloseTo(100, 0);

    await raf.advance(5000); // half elapsed

    expect(getCssVar(progressEl)).toBeCloseTo(50, 0);
  });

  it('stops at zero', async () => {
    const { container } = render(CountdownTimer, { props: { timer: 3 } });
    await raf.flushOne();

    await raf.advance(5000); // > duration

    const timeEl = container.querySelector('.countdown span');
    expect(getCssVar(timeEl)).toBe(0);

    const progressEl = container.querySelector('.radial-progress');
    expect(getCssVar(progressEl)).toBeCloseTo(0, 0);
  });

  it('cleans up animation frame on unmount', async () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(CountdownTimer);
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
