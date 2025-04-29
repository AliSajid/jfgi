import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import CountdownTimer from './CountdownTimer.svelte';
import { console } from 'inspector';

// Mock the browser environment
vi.mock('$app/environment', () => ({
  browser: true
}));

describe('CountdownTimer', () => {
  // Mock performance.now to have deterministic time
  let nowValue = 0;
  const originalPerformanceNow = global.performance.now;

  beforeEach(() => {
    nowValue = 0;
    global.performance.now = vi.fn(() => nowValue);
    vi.useFakeTimers();
  });

  afterEach(() => {
    global.performance.now = originalPerformanceNow;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should render with default props', () => {
    const { container } = render(CountdownTimer);
    expect(container.querySelector('.radial-progress')).not.toBeNull();
    expect(container.querySelector('.countdown')).not.toBeNull();
  });

  it('should accept custom timer prop', () => {
    const { container } = render(CountdownTimer, { props: { timer: 20 } });
    expect(container.querySelector('.countdown span')).not.toBeNull();
    // Initially should show 20 seconds
    expect(container.querySelector('.countdown span')?.getAttribute('style')).toContain(
      '--value: 20;'
    );
  });

  it('should update countdown every second', async () => {
    const { container, component } = render(CountdownTimer, { props: { timer: 5 } });

    // Initial state
    expect(container.querySelector('.countdown span')?.getAttribute('style')).toContain(
      '--value: 5;'
    );

    // Advance time by 1 second
    nowValue += 1000;

    // Manually trigger the update function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateMethod = component as any;
    if (typeof updateMethod.update === 'function') {
      updateMethod.update();
    }

    await tick(); // Wait for Svelte to update

    // Should now show 4 seconds
    expect(container.querySelector('.countdown span')?.getAttribute('style')).toContain(
      '--value: 4;'
    );
  });

  it('should update progress correctly', async () => {
    const { container, component } = render(CountdownTimer, { props: { timer: 10 } });

    // Initial state should be 100% progress
    expect(container.querySelector('.radial-progress')?.getAttribute('style')).toContain(
      '--value: 100;'
    );

    // Advance time by 5 seconds (50% of time passed)
    nowValue += 5000;

    // Manually trigger the update function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateMethod = component as any;
    if (typeof updateMethod.update === 'function') {
      updateMethod.update();
    }

    await tick();

    // Should now show approximately 50% progress
    const progressStyle = container.querySelector('.radial-progress')?.getAttribute('style');
    console.log(progressStyle?.toString());
    const progressValue = parseFloat(progressStyle?.match(/--value:([\d.]+)/)?.[1] || '0');
    console.log(progressValue.toString());
    expect(progressValue).toBeCloseTo(50, 0);
  });

  it('should stop at zero', async () => {
    const { container, component } = render(CountdownTimer, { props: { timer: 3 } });

    // Advance time beyond the timer duration
    nowValue += 5000; // 5 seconds > 3 seconds timer

    // Manually trigger the update function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateMethod = component as any;
    if (typeof updateMethod.update === 'function') {
      updateMethod.update();
    }

    await tick();

    // Should show 0 seconds
    expect(container.querySelector('.countdown span')?.getAttribute('style')).toContain(
      '--value: 0;'
    );

    // Progress should be at 0%
    const progressStyle = container.querySelector('.radial-progress')?.getAttribute('style');
    const progressValue = parseFloat(progressStyle?.match(/--value:([\d.]+)/)?.[1] || '0');
    expect(progressValue).toBeCloseTo(0, 0);
  });

  it('should clean up animation frame on unmount', async () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(CountdownTimer);

    // Unmount the component
    unmount();

    // Should have called cancelAnimationFrame
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });
});
