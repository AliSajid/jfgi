// timer.ts

type TimeProvider = () => number;
type RafCallback = (cb: FrameRequestCallback) => number;
type CancelRaf = (id: number) => void;

interface TimerOptions {
  now?: TimeProvider;
  requestFrame?: RafCallback;
  cancelFrame?: CancelRaf;
}

export class Timer {
  private duration: number;
  private onUpdateCallback: (timeRemaining: number, progressPercent: number) => void;
  private onCompleteCallback: () => void;

  private startTime: number | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  private now: TimeProvider;
  private requestFrame: RafCallback;
  private cancelFrame: CancelRaf;

  /**
   * Creates a new Timer instance
   * @param durationSeconds Duration in seconds
   * @param onUpdate Callback that receives timeRemaining and progressPercent on each update
   * @param onComplete Callback when timer completes
   * @param options Optional injectables for now(), requestAnimationFrame, cancelAnimationFrame
   */
  constructor(
    durationSeconds: number = 10,
    onUpdate: (timeRemaining: number, progressPercent: number) => void = () => {},
    onComplete: () => void = () => {},
    options: TimerOptions = {}
  ) {
    this.duration = durationSeconds * 1000;
    this.onUpdateCallback = onUpdate;
    this.onCompleteCallback = onComplete;

    this.now = options.now ?? performance.now.bind(performance);
    this.requestFrame = options.requestFrame ?? requestAnimationFrame;
    this.cancelFrame = options.cancelFrame ?? cancelAnimationFrame;
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = null;
    this.tick = this.tick.bind(this);
    this.animationFrameId = this.requestFrame(this.tick);
  }

  public pause(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      this.cancelFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public reset(autoStart: boolean = false): void {
    this.pause();
    this.startTime = null;

    this.onUpdateCallback(Math.ceil(this.duration / 1000), 100);

    if (autoStart) {
      this.start();
    }
  }

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

  public updateWithElapsed(elapsedMs: number): void {
    this.updateTimer(elapsedMs);
  }

  public destroy(): void {
    this.pause();
  }

  public getState(): { timeRemaining: number; progressPercent: number; isRunning: boolean } {
    const remainingMs = this.startTime
      ? Math.max(this.duration - (this.now() - this.startTime), 0)
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
      this.animationFrameId = this.requestFrame(this.tick);
    }
  }

  private updateTimer(elapsedMs: number): void {
    const remainingMs = Math.max(this.duration - elapsedMs, 0);
    const timeRemaining = Math.ceil(remainingMs / 1000);
    const progressPercent = (remainingMs / this.duration) * 100;

    this.onUpdateCallback(timeRemaining, progressPercent);

    if (remainingMs <= 0) {
      this.isRunning = false;

      if (this.animationFrameId !== null) {
        this.cancelFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      this.onCompleteCallback();
    }
  }
}
