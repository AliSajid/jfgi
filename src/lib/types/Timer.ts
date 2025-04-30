// timer.ts

export class Timer {
  private duration: number;
  private onUpdateCallback: (timeRemaining: number, progressPercent: number) => void;
  private onCompleteCallback: () => void;

  private startTime: number | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  /**
   * Creates a new Timer instance
   * @param durationSeconds Duration in seconds
   * @param onUpdate Callback that receives timeRemaining and progressPercent on each update
   * @param onComplete Callback when timer completes
   */
  constructor(
    durationSeconds: number = 10,
    onUpdate: (timeRemaining: number, progressPercent: number) => void = () => {},
    onComplete: () => void = () => {}
  ) {
    this.duration = durationSeconds * 1000; // Convert to milliseconds
    this.onUpdateCallback = onUpdate;
    this.onCompleteCallback = onComplete;
  }

  /**
   * Starts the timer
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = null; // Reset start time
    this.tick = this.tick.bind(this); // Ensure correct binding
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  /**
   * Pauses the timer
   */
  public pause(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resets the timer
   * @param autoStart Whether to automatically start the timer after reset
   */
  public reset(autoStart: boolean = false): void {
    this.pause();
    this.startTime = null;

    // Reset to initial state
    this.onUpdateCallback(Math.ceil(this.duration / 1000), 100);

    if (autoStart) {
      this.start();
    }
  }

  /**
   * Updates the timer duration
   * @param durationSeconds New duration in seconds
   * @param resetTimer Whether to reset the timer
   */
  public setDuration(durationSeconds: number, resetTimer: boolean = true): void {
    const wasRunning = this.isRunning;
    if (wasRunning) {
      this.pause();
    }

    this.duration = durationSeconds * 1000;

    if (resetTimer) {
      this.reset(wasRunning);
    } else if (wasRunning) {
      this.start();
    }
  }

  /**
   * Force updates the timer with a specific elapsed time (useful for testing)
   * @param elapsedMs Elapsed time in milliseconds
   */
  public updateWithElapsed(elapsedMs: number): void {
    this.updateTimer(elapsedMs);
  }

  /**
   * Cleans up resources
   */
  public destroy(): void {
    this.pause();
  }

  /**
   * Gets current state
   * @returns Object containing current timer state
   */
  public getState(): { timeRemaining: number; progressPercent: number; isRunning: boolean } {
    const remainingMs = this.startTime
      ? Math.max(this.duration - (performance.now() - this.startTime), 0)
      : this.duration;

    return {
      timeRemaining: Math.ceil(remainingMs / 1000),
      progressPercent: (remainingMs / this.duration) * 100,
      isRunning: this.isRunning
    };
  }

  private tick(timestamp: number): void {
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    const elapsed = timestamp - this.startTime;
    this.updateTimer(elapsed);

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.tick);
    }
  }

  private updateTimer(elapsedMs: number): void {
    // Calculate remaining time in milliseconds
    const remainingMs = Math.max(this.duration - elapsedMs, 0);

    // Calculate seconds remaining (ceiling to always round up for UX)
    const timeRemaining = Math.ceil(remainingMs / 1000);

    // Calculate progress percentage (0-100)
    const progressPercent = (remainingMs / this.duration) * 100;

    // Trigger update callback
    this.onUpdateCallback(timeRemaining, progressPercent);

    // Check if timer has completed
    if (remainingMs <= 0) {
      this.isRunning = false;

      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      this.onCompleteCallback();
    }
  }
}
